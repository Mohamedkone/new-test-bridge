import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Grid } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const PricingTable = ({currentPlan}:any) => {
  const {user} = useAuth()
  const [planList,setPlanList] = useState<any[]>()
  useEffect(()=>{
    const fetch =async()=>{
      await axios.get(`http://localhost:3001/plans`).then((res)=>{
        setPlanList(res.data)
        // console.log(user)
    })
  }
    fetch()
  },[user])
  return (
    <Box 
      display={'flex'} flexWrap={'wrap'}
      maxHeight={"500px"} overflow={'auto'}
      sx={{ flexGrow: 1, padding: "4px" }} gap={2} justifyContent={'center'}>
        {planList?.map((plan, index) => (
          <Grid  key={index} maxWidth={'25ch'}>
            <Card sx={{ textAlign: 'center', boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {plan.plan}
                </Typography>
                {plan.id !== "plan0000" && <Typography variant="h4" color="primary" sx={{ marginY: 2 }}>
                  {typeof plan.price === 'number' ? `US$${plan.price}` : plan.price}
                  {typeof plan.price === 'number' && <Typography variant="body2">per month</Typography>}
                </Typography>}
                {plan.id === "plan0000" && <Typography variant="h4" color="primary" sx={{ marginY: 2 }}>
                  US$--
                  <Typography variant="body2">per month</Typography>
                </Typography>}
                {currentPlan === plan.id &&
                <Typography>
                  Current plan  
                </Typography>}
                {plan.id === "plan0000"?<Button
                  variant="contained" 
                  fullWidth sx={{ mb: 2 }}
                  disabled={currentPlan === plan.id? true: false}
                >
                  Contact Us
                </Button>
                :
                <Button
                  variant="contained" 
                  fullWidth sx={{ mb: 2 }}
                  disabled={currentPlan === plan.id? true: false}
                >
                  Purchase
                </Button>}
                <List>
                  {plan.feature?.map((feature: any, i: React.Key | null | undefined) => (
                    <ListItem key={i} disablePadding>
                      <ListItemText primary={`• ${feature}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Box>
  );
};

export default PricingTable;
