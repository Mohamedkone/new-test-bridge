import { Avatar, Box, Typography } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'

function Profile() {
    const {user} = useAuth()
    return (
        <Box>
            <Box 
            display={'flex'} 
            flexWrap={'wrap'} 
            justifyContent={'space-evenly'}
            columnGap={5}
            rowGap={2}
            // alignItems={'center'}
            
            >
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Profile
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Set your account details
                    </Typography>
                </Box>
                
                <Box 
                    sx={{ mt: 2 }} 
                    width={"250px"}

                >
                    <Box>
                        <Typography variant='caption'>
                            Name
                        </Typography>
                        <Typography fontWeight={"bold"}>
                            {user?.firstName}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant='caption'>
                            Surname
                        </Typography>
                        <Typography fontWeight={"bold"}>
                        {user?.lastName}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant='caption'>
                            Email
                        </Typography>
                        <Typography fontWeight={"bold"}>
                        {user?.email}
                        </Typography>
                    </Box>
                </Box>
                <Box 
                    // alignSelf={'center'} 
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={'center'}
                    gap={2}
                >
                    <Avatar sx={{width:"100px", height:"100px"}}/>
                    {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
                    {/* <Button 
                    startIcon={<Edit />}
                    variant='outlined'
                    color='secondary'
                    onClick={HandleEdit}
                    sx={{
                        borderRadius:"30px",
                        boxShadow:"0px 1px 5px #ccc"
                    }}
                    >Edit Profile</Button> */}
                </Box>
            </Box>
        </Box>
    )
}

export default Profile
