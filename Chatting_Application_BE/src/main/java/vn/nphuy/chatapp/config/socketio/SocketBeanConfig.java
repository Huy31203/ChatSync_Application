package vn.nphuy.chatapp.config.socketio;

import org.json.JSONObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.socket.engineio.server.EngineIoServer;
import io.socket.engineio.server.EngineIoServerOptions;
import io.socket.socketio.server.SocketIoNamespace;
import io.socket.socketio.server.SocketIoServer;
import io.socket.socketio.server.SocketIoSocket;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.util.JsonUtils;

@Configuration
@Slf4j
public class SocketBeanConfig {
  @Bean
  EngineIoServer engineIoServer() {
    EngineIoServerOptions opt = EngineIoServerOptions.newFromDefault();
    opt.setCorsHandlingDisabled(true);
    return new EngineIoServer(opt);
  }

  @Bean
  SocketIoServer socketIoServer(EngineIoServer eioServer) {
    SocketIoServer sioServer = new SocketIoServer(eioServer);

    SocketIoNamespace namespace = sioServer.namespace("/conversations");

    namespace.on("connection", args -> {
      SocketIoSocket socket = (SocketIoSocket) args[0];
      log.info(
          "Client " + socket.getId() + " (" + socket.getInitialHeaders().get("remote_addr") + ") has connected.");

      socket.on("message", args1 -> {
        try {
          JSONObject messageData = (JSONObject) args1[0];
          MessageVo messageVo = JsonUtils.toPojoObj(messageData, MessageVo.class);

          log.info("[Message received] Client: {}, Content: {}", socket.getId(), messageVo);

          // Process the message (in a real app, you might save to database, etc.)
          // You could call a service here to handle the business logic

          // Send acknowledgment back to the client
          JSONObject response = new JSONObject();
          response.put("status", "delivered");
          response.put("timestamp", System.currentTimeMillis());
          response.put("messageId", messageData.optString("id", "unknown"));

          socket.send("messageAck", response);

          // Broadcast message to other clients in the same namespace if needed
          socket.broadcast("newMessage", messageData.toString());
        } catch (Exception e) {
          log.error("Error processing message from client: " + socket.getId(), e);

          // Send error response
          JSONObject errorResponse = new JSONObject();
          errorResponse.put("status", "error");
          errorResponse.put("message", "Failed to process your message");
          socket.send("error", errorResponse);
        }
      });
    });

    return sioServer;
  }

  record MessageVo(
      String author,
      String msg) {
  }
}
