using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (context.Users.Any()) return;

            var users = new List<User>
            {
                new User
                {
                    Username = "john_doe",
                    Email = "john.doe@example.com",
                    GoogleId = "googleId12345"
                },
                new User
                {
                    Username = "jane_smith",
                    Email = "jane.smith@example.com",
                    GoogleId = "googleId67890"
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();

            if (context.Roadmaps.Any()) return;  

            var roadmaps = new List<Roadmap>
            {
                new Roadmap
                {
                    Title = "Career Development",
                    Description = "Plan for developing key skills.",
                    CreatedBy = users[0].Id,
                    DateCreated = DateTime.UtcNow,
                    OverallProgress = 0,
                    OverallDuration = 6,
                    IsCompleted = false,
                    IsDeleted = false
                },
                new Roadmap
                {
                    Title = "Onboarding Process",
                    Description = "Training roadmap for new hires.",
                    CreatedBy = users[1].Id,
                    DateCreated = DateTime.UtcNow,
                    OverallProgress = 20,
                    OverallDuration = 3,
                    IsCompleted = false,
                    IsDeleted = false
                }
            };

            await context.Roadmaps.AddRangeAsync(roadmaps);
            await context.SaveChangesAsync();

            if (context.Milestones.Any()) return;  

            var milestones = new List<Milestone>
            {
                new Milestone
                {
                    RoadmapId = roadmaps[0].Id,
                    Name = "Introduction to Company",
                    Description = "Introduction to company culture and values.",
                    Duration = 1,
                    MilestoneProgress = 0,
                    IsCompleted = false,
                    IsDeleted = false
                },
                new Milestone
                {
                    RoadmapId = roadmaps[1].Id,
                    Name = "First Week Tasks",
                    Description = "Complete essential tasks for the first week.",
                    Duration = 1,
                    MilestoneProgress = 50,
                    IsCompleted = false,
                    IsDeleted = false
                }
            };

            await context.Milestones.AddRangeAsync(milestones);
            await context.SaveChangesAsync();

            if (context.Sections.Any()) return; 

            var sections = new List<Section>
            {
                new Section
                {
                    MilestoneId = milestones[0].Id,
                    Name = "Company Orientation",
                    Description = "Learn about company history, mission, and values.",
                    IsCompleted = false,
                    IsDeleted = false
                },
                new Section
                {
                    MilestoneId = milestones[1].Id,
                    Name = "Task Completion",
                    Description = "Complete the first set of tasks for the role.",
                    IsCompleted = false,
                    IsDeleted = false
                }
            };

            await context.Sections.AddRangeAsync(sections);
            await context.SaveChangesAsync();

            if (context.ToDoTasks.Any()) return; 

            var tasks = new List<ToDoTask>
            {
                new ToDoTask
                {
                    SectionId = sections[0].Id,
                    Name = "Read Company Handbook",
                    DateStart = DateTime.UtcNow.AddDays(1),
                    DateEnd = DateTime.UtcNow.AddDays(3),
                    IsCompleted = false,
                    IsDeleted = false
                },
                new ToDoTask
                {
                    SectionId = sections[1].Id,
                    Name = "Complete Onboarding Forms",
                    DateStart = DateTime.UtcNow.AddDays(2),
                    DateEnd = DateTime.UtcNow.AddDays(4),
                    IsCompleted = false,
                    IsDeleted = false
                }
            };

            await context.ToDoTasks.AddRangeAsync(tasks);
            await context.SaveChangesAsync();
        }
    }
}
