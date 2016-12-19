using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Wordris1.Models
{
    public class Word
    {
        [Key]
        public virtual int WordId { get; set; }
        public virtual string TheWord { get; set; }
        public virtual bool IsWord { get; set; }
        public virtual string Definition { get; set; }
        public virtual int Usage { get; set; }
    }
}