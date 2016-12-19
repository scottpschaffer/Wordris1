using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Wordris1.Models
{
    public class Score
    {
        [Key]
        public virtual int ScoreId { get; set; }
        public virtual string PlayerName { get; set; }
        public virtual int PlayerScore { get; set; }
    }
}