using Moq;
using System;
using System.Data.Entity;
using Wordris1.Models;
using System.Collections.Generic;
using System.Linq;
using Wordris1.DAL;

using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Wordris1.Tests.DAL
{
    [TestClass]
    public class WordrisRepoTests
    {
        private Mock<DbSet<Word>> mock_words { get; set; }
        private Mock<DbSet<Score>> mock_scores { get; set; }
        private Mock<WordrisContext> mock_context { get; set; }
        public Mock<WordrisRepository> Repo { get; set; }

        [TestInitialize]
        public void Initialize()
        {

        }


        [TestMethod]
        public void TestMethod1()
        {
            mock_context = new Mock<WordrisContext>();
            mock_words = new Mock<DbSet<Word>>();
            mock_scores = new Mock<DbSet<Score>>();
            Repo = new Mock<WordrisRepository>(mock_context.Object);


        }
    }
}
