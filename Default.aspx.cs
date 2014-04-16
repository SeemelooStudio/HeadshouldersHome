using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        var iUrl = Request.ServerVariables["SERVER_NAME"].Split('.');
        if (string.Compare(iUrl[0], "pantene", true) == 0 || string.Compare(iUrl[0], "pantenehairlab", true) == 0)
        {
            Response.Redirect("/pntProduction");
        }
        else
        {
            Response.Redirect("index.html");
        }
    }
}