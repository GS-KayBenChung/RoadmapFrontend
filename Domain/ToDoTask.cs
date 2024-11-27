namespace Domain
{
    public class ToDoTask
    {
        public Guid Id { get; set; }
        public Guid SectionId { get; set; }
        public string Name { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsDeleted { get; set; }

        public Section Section { get; set; }
    }
}
