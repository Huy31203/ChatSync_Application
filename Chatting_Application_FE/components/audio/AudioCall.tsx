'use client';

import { useEffect, useRef, useState } from 'react';

import { useSocket } from '@/hooks/useSocket';

interface AudioCallProps {
  channelId: string;
}

export const AudioCall = ({ channelId }: AudioCallProps) => {
  const { isConnected, sendAudioSignal, subscribeToAudioSignal } = useSocket({
    onConnect: () => console.log('Connected to audio signaling server'),
    onError: (error) => console.error('Audio signaling error:', error),
  });

  // State to hold the RTCPeerConnection instance
  const [pc, setPc] = useState(null);
  // Ref for the local audio stream
  const localStreamRef = useRef(null);
  // Ref for the remote audio element
  const remoteAudioRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  // Initialize peer connection and local stream on mount
  useEffect(() => {
    if (!isConnected) return;

    // Create a new RTCPeerConnection with a public STUN server
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // Handle ICE candidates by sending them through the signaling channel
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendAudioSignal(`/app/channels/${channelId}/signal`, {
          type: 'candidate',
          payload: event.candidate,
        });
      }
    };

    // When a remote track is received, attach it to the audio element
    peerConnection.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind);

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
        console.log('Remote stream attached to audio element');

        // Log when audio is actually flowing
        const audioTrack = event.streams[0].getAudioTracks()[0];
        if (audioTrack) {
          console.log('Audio track state:', audioTrack.readyState);
          audioTrack.onmute = () => console.log('Remote audio track muted');
          audioTrack.onunmute = () => console.log('Remote audio track unmuted - receiving audio');
        }
      }
    };

    console.log('Peer connection created:', peerConnection);

    setPc(peerConnection);

    // Get the local audio stream from the user's microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        // Add each audio track to the peer connection
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      })
      .catch((error) => {
        console.error('Error accessing audio devices:', error);
      });

    // Cleanup: close the connection and stop local tracks on unmount
    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [sendAudioSignal, channelId, isConnected]);

  useEffect(() => {
    if (!isConnected || !pc) return;

    const subscription = subscribeToAudioSignal(`/topic/channels/${channelId}/signal`, async (signal) => {
      console.log('Received audio signal:', signal, 'Current connection state:', pc.signalingState);
      if (!pc) return;

      try {
        switch (signal.type) {
          case 'offer': {
            // Only process offer if we're in stable state
            if (pc.signalingState !== 'stable') {
              console.warn('Cannot set remote offer in state:', pc.signalingState);
              return;
            }

            // Set the remote description with the received offer
            await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));

            // Create and send an answer
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendAudioSignal(`/app/channels/${channelId}/signal`, {
              type: 'answer',
              payload: answer,
              timestamp: Date.now(), // Add timestamp to prevent duplicate processing
            });
            break;
          }
          case 'answer': {
            // Only process answer if we're in have-local-offer state
            if (pc.signalingState !== 'have-local-offer') {
              console.warn('Cannot set remote answer in state:', pc.signalingState);
              return;
            }

            // Set the remote description with the received answer
            await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
            break;
          }
          case 'candidate': {
            // Store candidates if remote description isn't set yet
            if (pc.remoteDescription === null) {
              console.log('Buffering ICE candidate until remote description is set');
              pendingCandidatesRef.current.push(signal.payload);
              return;
            }

            try {
              await pc.addIceCandidate(new RTCIceCandidate(signal.payload));
              console.log('Added ICE candidate successfully');
            } catch (error) {
              console.error('Error adding received ICE candidate:', error);
            }
            break;
          }
          default:
            console.warn('Unknown signal type:', signal.type);
            break;
        }
        if (pendingCandidatesRef.current.length > 0) {
          console.log(`Processing ${pendingCandidatesRef.current.length} pending ICE candidates`);
          const candidates = [...pendingCandidatesRef.current];
          pendingCandidatesRef.current = [];

          for (const candidate of candidates) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
              console.log('Added buffered ICE candidate');
            } catch (error) {
              console.error('Error adding buffered ICE candidate:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error handling WebRTC signal:', error);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [subscribeToAudioSignal, sendAudioSignal, pc, channelId, isConnected]);

  useEffect(() => {
    // Monitor audio levels of remote stream
    if (remoteAudioRef.current && remoteAudioRef.current.srcObject) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(remoteAudioRef.current.srcObject);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);

        // Calculate average audio level
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        if (average > 10) {
          // Threshold for considering actual audio vs noise
          console.log('Audio signal detected, level:', average.toFixed(2));
        }

        requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();

      return () => {
        source.disconnect();
        audioContext.close();
      };
    }
  }, [remoteAudioRef.current?.srcObject]);

  // Function to initiate an audio call by creating an offer
  const initiateAudioCall = async () => {
    if (!pc) {
      console.error('Peer connection not ready');
      return;
    }

    try {
      // Only create offer if in stable state
      if (pc.signalingState !== 'stable') {
        console.warn('Cannot create offer in state:', pc.signalingState);
        return;
      }

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendAudioSignal(`/app/channels/${channelId}/signal`, {
        type: 'offer',
        payload: offer,
      });
    } catch (error) {
      console.error('Error initiating audio call:', error);
    }
  };

  return (
    <div>
      <button onClick={initiateAudioCall}>Start Audio Call</button>
      <audio ref={remoteAudioRef} autoPlay controls>
        <track kind="captions" />
      </audio>
    </div>
  );
};
