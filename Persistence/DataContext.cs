using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Roadmap> Roadmaps { get; set; }
        public DbSet<Milestone> Milestones { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<ToDoTask> ToDoTasks { get; set; }
        public DbSet<Log> Logs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {          
             modelBuilder.Entity<User>()
            .HasKey(u => u.Id); 

            modelBuilder.Entity<Roadmap>()
                .HasKey(r => r.Id); 

            modelBuilder.Entity<Milestone>()
                .HasKey(m => m.Id); 

            modelBuilder.Entity<Section>()
                .HasKey(s => s.Id); 

            modelBuilder.Entity<ToDoTask>()
                .HasKey(t => t.Id); 

            modelBuilder.Entity<Log>()
                //.HasKey(l => l.Id)
                .HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserId);

            base.OnModelCreating(modelBuilder);
        }
    }
}