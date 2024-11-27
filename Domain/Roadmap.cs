namespace Domain
{
    public class Roadmap
    {
        public Guid Id { get; set; } 
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid CreatedBy { get; set; } 
        public DateTime DateCreated { get; set; }
        public int OverallProgress { get; set; }
        public int OverallDuration { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsDeleted { get; set; }

        public User CreatedByUser { get; set; }

        public ICollection<Milestone> Milestones { get; set; } = new List<Milestone>();
    }
}
