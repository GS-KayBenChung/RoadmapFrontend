namespace Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string GoogleId { get; set; }

        public ICollection<Roadmap> Roadmaps { get; set; } = new List<Roadmap>();
    }
}
