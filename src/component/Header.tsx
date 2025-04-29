import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {format} from "date-fns";
import { useState } from 'react';
import Button from '@mui/material/Button';

function Header()
{
    let [currentDate, updatecurrentDate] = useState(new Date());
    let [accountId, updateAccountId] = useState<string | null>(null);    
    setInterval(() => {updatecurrentDate(new Date())}, 1000)
    return <>
    <Stack direction={"row"} spacing={1} divider= {<Divider orientation="vertical" flexItem></Divider>}>
          <img alt= "Image" ></img>
          <div>GenuineSoft</div>          
        <Button></Button>        
        <div>{format(currentDate, "dd/MM/yyyy h:mm aa")}</div>
          </Stack> 
    </>
}
export default Header;