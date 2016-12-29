namespace Wordris1.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using Wordris1.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<Wordris1.DAL.WordrisContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Wordris1.DAL.WordrisContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            context.Words.AddOrUpdate(
                p => p.TheWord,
                new Word { TheWord = "TAT", IsWord = true, Definition = "A slangword for tatoo", Usage = 1 }
                );
        }
    }
}
