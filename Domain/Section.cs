namespace Domain
{
    public class Section
    {
        public Guid Id { get; set; }
        public Guid MilestoneId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsDeleted { get; set; }

        public Milestone Milestone { get; set; }

        public ICollection<ToDoTask> Tasks { get; set; } = new List<ToDoTask>();
    }
}
