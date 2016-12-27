using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Wordris1.DAL;
using Wordris1.Models;

namespace Wordris1.Controllers
{
    public class WordController : ApiController
    {

        WordrisRepository Repo = new WordrisRepository();
        
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(string werd)
        {
            if (Repo.IsBadWord(werd) == "true")
            {
                return "true";
            }
            else
            {
                return Repo.IsGoodWord(werd);
            }
        }

        // POST api/<controller>
        public void Post([FromBody]string werd, bool inDict, string def)
        {
            Word w = new Word();
            w.TheWord = werd;
            w.IsWord = inDict;
            w.Definition = def;
            if (!(Repo.WordExists(werd)))
            {
                Repo.AddWord(w);
            }
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}