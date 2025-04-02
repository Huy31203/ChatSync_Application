package vn.nphuy.chatapp.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignalMessage {
  private String channelId; // Unique identifier for the group call room
  private String type; // "offer", "answer", "candidate", etc.
  private String from;
  private String to; // Optional: specify a target participant
  private Object payload; // Contains the SDP or ICE candidate details
}
