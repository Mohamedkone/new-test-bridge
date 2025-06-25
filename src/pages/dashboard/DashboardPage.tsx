import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Cloud,
  // Storage,
  // Folder,
  Contacts,
  Download,
  CheckCircle as CheckIcon,
  Cancel as ErrorIcon,
  AccessTime as ClockIcon,
} from '@mui/icons-material';
import BigCard from '../../components/common/BigCard';
import ActivityTimeline from './components/ActivityTimeline';
import NewsCard from './components/NewsCard';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {

  // Mock data
  const stats = {
    storageLeft: '916GB',
    activeBridges: 0,
    filesReceived: 0,
  };

  const activeBridges = [
    { id: 1, expireIn: '2 days', name: 'Project Files', action: 'View' },
    { id: 2, expireIn: '1 week', name: 'Documents', action: 'View' },
  ];

  const recentActivity = [
    {
      id: 1,
      time: '9:30 am',
      type: 'received',
      title: 'Received Files',
      description: 'Someone sent you a file',
      icon: <Download />,
      iconBg: '#e0f2fe',
      iconColor: '#0277bd',
    },
    {
      id: 2,
      time: '10:00 am',
      type: 'request',
      title: 'Bridge Request',
      description: 'John Doe sent you a bridge request',
      icon: <ClockIcon />,
      iconBg: '#e3f2fd',
      iconColor: '#1976d2',
    },
    {
      id: 3,
      time: 'Earlier',
      type: 'created',
      title: 'Bridge Created',
      description: 'An anonymous bridge was created',
      icon: <CheckIcon />,
      iconBg: '#e8f5e8',
      iconColor: '#2e7d32',
    },
    {
      id: 4,
      time: 'Earlier',
      type: 'expired',
      title: 'Bridge Expired',
      description: 'One of your bridges have expired',
      icon: <ErrorIcon />,
      iconBg: '#ffebee',
      iconColor: '#d32f2f',
    },
  ];

  const activeIntegrations = [
    { name: 'Google Drive', status: 'Connected', color: '#4285f4' },
    { name: 'Dropbox', status: 'Connected', color: '#0061ff' },
    { name: 'OneDrive', status: 'Disconnected', color: '#0078d4' },
  ];

  const breachNews = [
    {
      id: 1,
      title: '30000 database breached',
      description: 'Lorem ipsum dolor sit, amet consectetur a...',
      time: 'Today',
    },
    {
      id: 2,
      title: '30000 database breached',
      description: 'Lorem ipsum dolor sit, amet consectetur a...',
      time: 'Today',
    },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Stats Cards */}
      <Box display={'flex'} flexWrap={"wrap"} justifyContent={"space-evenly"} py={5} gap={5}>
          <Card sx={{ 
            bgcolor: '#dbeafe', 
            border: 'none',
            boxShadow: 'none',
            borderRadius: '12px',
            width: "200px"
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Cloud />
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                  {stats.storageLeft}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Storage left
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ 
            bgcolor: '#f3e8ff', 
            border: 'none',
            boxShadow: 'none',
            borderRadius: '12px',
            width: "200px"
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Contacts />
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                  {stats.activeBridges}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Active bridges
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ 
            bgcolor: '#fed7aa', 
            border: 'none',
            boxShadow: 'none',
            borderRadius: '12px',
            width: "200px"
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Download />
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                  {stats.filesReceived}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Files received
                </Typography>
              </Box>
            </CardContent>
          </Card>
      </Box>
      <Box display={"flex"} flexDirection={"column"} gap={5}>
      <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"} gap={5}>
        <BigCard width={"min(90dvw, 500px)"}
          minHeight={"200px"}
          maxHeight={"420px"}
          title={"Active Bridges"}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Active Bridges
                </Typography>
                <Link 
                  to={"/bridge"}
                  style={{ 
                    color: '#3b82f6',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight:"bold",
                    textDecoration:"none"
                  }}
                >
                  See More
                </Link>
              </Box>
              
              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 300 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ border: 'none', color: '#64748b', fontSize: '14px' }}>
                          Expire In
                        </TableCell>
                        <TableCell sx={{ border: 'none', color: '#64748b', fontSize: '14px' }}>
                          Name
                        </TableCell>
                        <TableCell sx={{ border: 'none', color: '#64748b', fontSize: '14px' }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeBridges.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} sx={{ border: 'none', textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No active bridges
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        activeBridges.map((bridge) => (
                          <TableRow key={bridge.id}>
                            <TableCell sx={{ border: 'none', fontSize: '14px' }}>
                              {bridge.expireIn}
                            </TableCell>
                            <TableCell sx={{ border: 'none', fontSize: '14px' }}>
                              {bridge.name}
                            </TableCell>
                            <TableCell sx={{ border: 'none' }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                sx={{ 
                                  textTransform: 'none',
                                  borderColor: '#e2e8f0',
                                  color: '#64748b',
                                  fontSize: '12px',
                                }}
                              >
                                {bridge.action}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
        </BigCard>
        <BigCard width={"min(90dvw, 300px)"}
          minHeight={"200px"}
          maxHeight={"420px"}
          title={"Active Storages"}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Active integrations
                </Typography>
                <Button 
                  variant="text" 
                  sx={{ 
                    color: '#3b82f6',
                    textTransform: 'none',
                    fontSize: '14px',
                  }}
                >
                  See More
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activeIntegrations.map((integration, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: integration.color,
                        borderRadius: '50%',
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1, fontSize: '14px' }}>
                      {integration.name}
                    </Typography>
                    <Chip
                      label={integration.status}
                      size="small"
                      sx={{
                        bgcolor: integration.status === 'Connected' ? '#dcfce7' : '#fee2e2',
                        color: integration.status === 'Connected' ? '#166534' : '#dc2626',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                ))}
              </Box>
              </BigCard>
      </Box>
     <Box display={"flex"}  flexWrap={"wrap"} justifyContent={"center"} gap={5}>
          <BigCard
            width={"min(90dvw, 500px)"}
            minHeight={"200px"}
            maxHeight={"420px"}
            title={"Recent activity"}
          >
            <Box className="blur-bottom">
              <Box 
                sx={{
                  overflowY: "auto",
                  maxHeight: "320px"
                }}
              >
                <ActivityTimeline />
              </Box>
            </Box>
          </BigCard>
          <BigCard
            width={"min(90dvw, 500px)"}
            minHeight={"200px"}
            maxHeight={"420px"}
            title={"Data breaches news"}
          >
            <Box 
              maxHeight={"330px"}
              sx={{ overflowY: "auto" }}
            >
              <NewsCard 
                thumbnail={logo} 
                title={"30000 database breached"} 
                desc={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, pariatur atque esse laudantium aut a quis veritatis architecto dignissimos porro!"}
                date={"Today"}
              />
              <NewsCard 
                thumbnail={logo} 
                title={"30000 database breached"} 
                desc={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, pariatur atque esse laudantium aut a quis veritatis architecto dignissimos porro!"}
                date={"Today"}
              />
              <NewsCard 
                thumbnail={logo} 
                title={"30000 database breached"} 
                desc={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, pariatur atque esse laudantium aut a quis veritatis architecto dignissimos porro!"}
                date={"Today"}
              />
              <NewsCard 
                thumbnail={logo} 
                title={"30000 database breached"} 
                desc={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, pariatur atque esse laudantium aut a quis veritatis architecto dignissimos porro!"}
                date={"Today"}
              />
              <NewsCard 
                thumbnail={logo} 
                title={"30000 database breached"} 
                desc={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, pariatur atque esse laudantium aut a quis veritatis architecto dignissimos porro!"}
                date={"Today"}
              />
            </Box>
          </BigCard>
      </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;