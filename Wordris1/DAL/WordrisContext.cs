using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Wordris1.Models;

namespace Wordris1.DAL
{
    public class WordrisContext : ApplicationDbContext
    {
        public virtual DbSet<Score> Scores { get; set; }
        public virtual DbSet<Word> Words { get; set; }
    }
}