using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Wordris1.Models;

namespace Wordris1.DAL
{
    public class WordrisRepository
    {
        public WordrisContext Context { get; set; }

        public WordrisRepository(WordrisContext _context)
        {
            Context = _context;
        }

        public WordrisRepository()
        {
            Context = new WordrisContext();
        }

        public void AddWord(string theWord, bool isWord, string definition)
        {
            Word new_word = new Models.Word
            {
                TheWord = theWord,
                IsWord = isWord,
                Definition = definition,
                Usage = 1
            };

            Context.Words.Add(new_word);
            Context.SaveChanges();
        }

        public bool WordExists(string theWord)
        {
            Word findWord = Context.Words.FirstOrDefault(u => u.TheWord.ToLower() == theWord);
            if (findWord != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsBadWord(string theWord)
        {
            if (this.WordExists(theWord))
            {
                if (Context.Words.(u => u.IsWord == false))
            }
                ){

            }
        }
    }
}