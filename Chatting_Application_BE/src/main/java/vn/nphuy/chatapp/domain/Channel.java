package vn.nphuy.chatapp.domain;

public class Channel extends AbstractEntity {

    private String name;

    private String type;

      private boolean isDeleted;

    private List<Member> members;

    private List<Message> messages;

    public List<Member> getMembers() {
        return members != null
                ? members.stream().filter(member -> !member.isDeleted()).toList()
                : List.of();
    }

    public List<Message> getMessages() {
        return messages != null
                ? messages.stream().filter(message -> !message.isDeleted()).toList()
                : List.of();
    }
  
}
