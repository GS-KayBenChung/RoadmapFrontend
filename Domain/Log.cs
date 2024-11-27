namespace Domain
{
    public class Log
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ActivityAction { get; set; }
        public DateTime DateCreated { get; set; }

        public User User { get; set; }  
    }
}
