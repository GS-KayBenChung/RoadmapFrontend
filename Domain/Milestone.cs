namespace Domain
{
    public class Milestone
    {
        public Guid Id { get; set; } 
        public Guid RoadmapId { get; set; } 
        public string Name { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public int MilestoneProgress { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsDeleted { get; set; }

        public Roadmap Roadmap { get; set; }

        public ICollection<Section> Sections { get; set; } = new List<Section>();
    }
}
