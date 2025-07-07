// src/pages/account/Storage.tsx
import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Switch,
    FormControlLabel,
    Alert,
    CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Cancel, Edit, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { platforms } from "./plateform";
import { useAuth } from "../../contexts/AuthContext";
import { storageService, type StorageAccount, type CreateStorageAccountData } from "../../services/storage.service";
import { oauthService } from "../../services/oauth.service";

interface StorageProps {
    setSelectedTab: (tab: number) => void;
}

const Storage = ({ setSelectedTab }: StorageProps) => {
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [existingStorage, setExistingStorage] = useState<StorageAccount[]>([]);
    const [filteredList, setFilteredList] = useState<StorageAccount[]>([]);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [useSignedUrl, setUseSignedUrl] = useState(false);
    const [expanded, setExpanded] = useState<StorageAccount | null>(null);
    const [editing, setEditing] = useState(false);
    const [removeList, setRemoveList] = useState<string[]>([]);
    const [removeApiList, setRemoveApiList] = useState<string[]>([]);
    const [ds, setDs] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    // Load storage accounts on component mount
    useEffect(() => {
        if (user?.id) {
            loadStorageAccounts();
            loadVaultStorage();
        }
    }, [user?.id]);

    // Update filtered list when removeList changes
    useEffect(() => {
        filterList();
    }, [removeList, existingStorage]);

    const loadStorageAccounts = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const accounts = await storageService.getStorageAccounts(user.id);
            setExistingStorage(accounts);
            setFilteredList(accounts);
        } catch (error) {
            setError('Failed to load storage accounts');
            console.error('Failed to load storage accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadVaultStorage = async () => {
        if (!user?.id) return;

        try {
            const vaultData = await storageService.getVaultStorage(user.id);
            setDs(vaultData);
        } catch (error) {
            console.error('Failed to load vault storage:', error);
        }
    };

    const handleSelectPlatform = (platformKey: string) => {
        setSelectedPlatform(platformKey);
        setFormData({});
        setUseSignedUrl(false);
        setError(null);
    };

    const handleInputChange = (key: string, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSaveStorage = async () => {
        if (!selectedPlatform || !user?.id) return;

        try {
            setLoading(true);
            setError(null);

            const storageData: CreateStorageAccountData = {
                name: formData.alias || `${platforms[selectedPlatform].name} Storage`,
                userId: user.id,
                storageType: platforms[selectedPlatform].name.toLowerCase().replace(/\s+/g, '_'),
                credentials: {
                    endpoint: formData["Endpoint URL"],
                    accessKeyId: formData["Access Key ID"],
                    secretAccessKey: formData["Secret Access Key"],
                    bucketName: formData["Bucket Name"],
                    region: formData["Region"],
                }
            };

            await storageService.createStorageAccount(storageData);
            setSuccess('Storage account created successfully');
            
            // Reload storage accounts
            await loadStorageAccounts();
            
            // Reset form
            setSelectedPlatform(null);
            setFormData({});
        } catch (error) {
            setError('Failed to create storage account');
            console.error('Failed to create storage account:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditing = () => {
        setEditing(!editing);
        if (editing) {
            // Cancel editing - reset remove lists
            setRemoveList([]);
            setRemoveApiList([]);
        }
    };

    const handleCancel = () => {
        setRemoveList([]);
        setRemoveApiList([]);
        setEditing(false);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);

            // Delete selected storage accounts
            const allToDelete = [...removeList, ...removeApiList];
            if (allToDelete.length > 0) {
                await storageService.deleteMultipleStorageAccounts(allToDelete);
                setSuccess('Storage accounts deleted successfully');
            }

            // Reload storage accounts
            await loadStorageAccounts();
            
            // Reset state
            setRemoveList([]);
            setRemoveApiList([]);
            setEditing(false);
        } catch (error) {
            setError('Failed to delete storage accounts');
            console.error('Failed to delete storage accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const toBeRemove = (newId: string) => {
        setRemoveList((prev) => [...prev, newId]);
    };

    const apiToBeRemove = (newId: string) => {
        setRemoveApiList((prev) => [...prev, newId]);
    };

    const filterList = () => {
        const allRemoved = [...removeList, ...removeApiList];
        setFilteredList(existingStorage.filter((x) => !allRemoved.includes(x.id)));
    };

    const handleMembership = () => {
        navigate('/account?tab=4');
        setSelectedTab(4);
    };

    const connectGoogleDrive = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await oauthService.authorizeGoogleDrive(user.id);
            window.location.href = response.authUrl;
        } catch (error) {
            setError('Failed to start Google Drive connection');
            console.error('Failed to start Google Drive OAuth:', error);
        } finally {
            setLoading(false);
        }
    };

    const connectDropbox = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await oauthService.authorizeDropbox(user.id);
            window.location.href = response.authUrl;
        } catch (error) {
            setError('Failed to start Dropbox connection');
            console.error('Failed to start Dropbox OAuth:', error);
        } finally {
            setLoading(false);
        }
    };

    const oAuthChoice = (name: string) => {
        if (name === 'Dropbox') {
            connectDropbox();
        } else if (name === 'Google Drive') {
            connectGoogleDrive();
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 0) return 'Invalid value';
        if (bytes === 0) return '0 Bytes';

        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
        const base = 1000;

        const i = Math.floor(Math.log(bytes) / Math.log(base));
        const value = (bytes / Math.pow(base, i)).toFixed(2);

        return `${parseFloat(value)} ${units[i]}`;
    };

    const handleOpenStorageCard = (storage: StorageAccount) => {
        setExpanded((prevExpanded) =>
            prevExpanded?.id === storage.id ? null : storage
        );
    };

    const testStorageConnection = async (storageId: string) => {
        try {
            setLoading(true);
            const result = await storageService.testConnection(storageId);
            if (result.success) {
                setSuccess('Storage connection test successful');
            } else {
                setError(result.message || 'Storage connection test failed');
            }
        } catch (error) {
            setError('Failed to test storage connection');
            console.error('Failed to test storage connection:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={4} display={'flex'} flexDirection={'column'} gap={2}>
            <Typography variant="h3" gutterBottom>
                Storage Integrations
            </Typography>

            {/* Error and Success Messages */}
            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {/* Loading Indicator */}
            {loading && (
                <Box display="flex" justifyContent="center" my={2}>
                    <CircularProgress />
                </Box>
            )}

            {/* Vault Storage Section */}
            <Box display={'flex'} flexDirection={'column'}>
                <Typography variant="h4" gutterBottom>
                    Vault Storage
                </Typography>
                <Box
                    display={'flex'}
                    justifyContent={'space-evenly'}
                    alignItems={"center"}
                    sx={{
                        background: "none",
                        boxShadow: "0 1px 5px #ccc",
                        minWidth: "calc(min(300px, 90dvw))",
                        minHeight: "100px"
                    }}
                >
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography variant="h5">Storage Type</Typography>
                        <Typography fontWeight={'bold'}>{ds?.type || '---'}</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography variant="h5">Capacity</Typography>
                        <Typography fontWeight={'bold'}>{ds ? formatBytes(ds.size) : '--'}</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography variant="h5">Region</Typography>
                        <Typography fontWeight={'bold'}>US-1</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection={'column'}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleMembership}
                        >
                            Manage Plan
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Existing Storage Section */}
            <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h4" mt={3}>
                    Existing Storage
                </Typography>
                {editing ? (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            startIcon={<Cancel />}
                            variant="contained"
                            color="error"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            startIcon={<Save />}
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </Box>
                ) : (
                    <Button
                        startIcon={<Edit />}
                        variant="contained"
                        color="primary"
                        onClick={handleEditing}
                    >
                        Edit
                    </Button>
                )}
            </Box>

            {/* Storage Cards */}
            <Box display={"flex"} gap={3} flexWrap={"wrap"}>
                {filteredList?.map((storage) => (
                    <Box key={storage.id} mt={2}>
                        <Card sx={{
                            background: "none",
                            boxShadow: "0 1px 5px #ccc",
                            width: "calc(min(300px, 90dvw))",
                            maxWidth: "400px"
                        }}>
                            <CardContent
                                onClick={() => handleOpenStorageCard(storage)}
                                sx={{
                                    cursor: "pointer",
                                    textAlign: "center"
                                }}
                            >
                                <Typography variant="h4">{storage.name}</Typography>
                                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <Typography variant="caption">{storage.storageType}</Typography>
                                    <ExpandMoreIcon />
                                </Box>
                                {expanded?.id === storage.id && (
                                    <Box mt={2}>
                                        <Typography>
                                            {storage.isDefault ? 'Default Storage' : 'Connected'}
                                        </Typography>
                                        
                                        <Box display="flex" gap={1} mt={2} justifyContent="center">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    testStorageConnection(storage.id);
                                                }}
                                            >
                                                Test Connection
                                            </Button>
                                            
                                            {editing && (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toBeRemove(storage.id);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            {/* Add New Storage Section */}
            <Typography variant="h4" mt={4}>
                Add New Storage
            </Typography>

            <Box display={"flex"} gap={3} flexWrap={"wrap"}>
                {Object.entries(platforms).map(([key, platform]) => (
                    platform.available && (
                        <Box key={key} mt={2}>
                            <Card
                                sx={{
                                    background: platform.bkc,
                                    color: platform.color,
                                    cursor: "pointer",
                                    width: "200px",
                                    height: "150px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        transition: "transform 0.2s"
                                    }
                                }}
                                onClick={() => {
                                    if (platform.inputs.oauth) {
                                        oAuthChoice(platform.name);
                                    } else {
                                        handleSelectPlatform(key);
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <Typography variant="h5">{platform.name}</Typography>
                                    <Typography variant="caption">{platform.caption}</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    )
                ))}
            </Box>

            {/* Configuration Form for Selected Platform */}
            {selectedPlatform && platforms[selectedPlatform] && !platforms[selectedPlatform].inputs.oauth && (
                <Box mt={4} p={3} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
                    <Typography variant="h5" mb={2}>
                        Configure {platforms[selectedPlatform].name}
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Storage Name"
                            value={formData.alias || ""}
                            onChange={(e) => handleInputChange("alias", e.target.value)}
                            fullWidth
                        />

                        {platforms[selectedPlatform].inputs.keys?.map((key) => (
                            <TextField
                                key={key}
                                label={key}
                                value={formData[key] || ""}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                type={key.toLowerCase().includes("secret") ? "password" : "text"}
                                fullWidth
                                required
                            />
                        ))}

                        {platforms[selectedPlatform].inputs.signedUrl && (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={useSignedUrl}
                                        onChange={(e) => setUseSignedUrl(e.target.checked)}
                                    />
                                }
                                label="Use Signed URLs"
                            />
                        )}

                        <Box display="flex" gap={2} mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveStorage}
                                disabled={loading}
                            >
                                Save Storage
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setSelectedPlatform(null)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Storage;