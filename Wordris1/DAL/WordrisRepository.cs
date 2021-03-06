﻿using System;
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

        public void AddWord(Word werd)
        {
            Context.Words.Add(werd);
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

        public string IsBadWord(string theWord)
        {
            Word findWord = Context.Words.FirstOrDefault(u => ((u.TheWord.ToLower() == theWord.ToLower()) && (u.IsWord == false)));
            if (findWord != null)
            {
                return "true";
            }
            else
            {
                return "-1";
            }
        }

        public string IsGoodWord(string theWord)
        {
            Word findWord = Context.Words.FirstOrDefault(u => ((u.TheWord.ToLower() == theWord.ToLower()) && (u.IsWord)));
            if (findWord != null)
            {
                return findWord.Definition;
            }
            else
            {
                return "-1";
            }
        }

        public void AddScore(Score theScore)
        {
            Context.Scores.Add(theScore);
            Context.SaveChanges();
        }

        public List<int> GetPlayerScores()
        {
            return Context.Scores.Select(u => u.PlayerScore).ToList();
        }

        public List<Score> GetScores()
        {
            return Context.Scores.ToList();
        }
    }
}