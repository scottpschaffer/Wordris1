using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Wordris1.Startup))]
namespace Wordris1
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
