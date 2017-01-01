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

    public class ScoreController : ApiController
    {

        WordrisRepository Repo = new WordrisRepository();

        // GET api/<controller>
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        // GET api/<controller>/5
        public List<Score> Get()
        {
            //List<Score> ret_score = new List<Score>();
            //Score tempScore = new Score();
            //List<int> scoreNums = Repo.GetPlayerScores();
            //List<string> scoreNames = Repo.GetPlayerNames();
            //for (var x = 0; x < scoreNums.Count; x++)
            //{
            //    tempScore.PlayerName = scoreNames[x];
            //    tempScore.PlayerScore = scoreNums[x];
            //    ret_score.Add(tempScore);
            //}
            return Repo.GetScores();
        }

        // POST api/<controller>
        public void Post([FromBody]Score score)
        {
            Repo.AddScore(score);
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