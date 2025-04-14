import { useEffect, useState } from "react";
import httpClient from "../helper/httpClient";

function App()
{
    App(IHttpClient)
    {

    }
    const [pullrequests, setPullRequests] = useState([]);
    useEffect(() => {
        const getPullRequest = async () => {
            await httpClient.("")
        }
        getPullRequest();
    },[])
    return(<>
    <table></table>
    </>)
}
export default App;