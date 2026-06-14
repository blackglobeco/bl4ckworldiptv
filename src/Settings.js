import { useState, useContext } from "react";
import Page from "./components/Page";
// MUI
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
// Icons
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DownloadIcon from "@mui/icons-material/Download";
// Others
import parser from "iptv-playlist-parser";
import { GlobalContext } from "./App";
import db from "./config/dexie";

const BUILT_IN_PLAYLISTS = [
  { name: "🇦🇱 Albania", url: "https://iptv-org.github.io/iptv/countries/al.m3u" },
  { name: "🇩🇿 Algeria", url: "https://iptv-org.github.io/iptv/countries/dz.m3u" },
];

export default function Settings() {
  const [autoplay, setAutoplay] = useState(
    localStorage.getItem("autoplay") === "true"
  );
  const [defaultCategory, setDefaultCategory] = useState(
    localStorage.getItem("defaultCategory") || "All channels"
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loadingPlaylist, setLoadingPlaylist] = useState(null);

  const { setAlertMessage, setSelectedPlaylistName } = useContext(GlobalContext);

  const handleAutoplayToggle = () => {
    const newVal = !autoplay;
    setAutoplay(newVal);
    localStorage.setItem("autoplay", String(newVal));
  };

  const handleDefaultCategoryChange = (e) => {
    const val = e.target.value;
    setDefaultCategory(val);
    localStorage.setItem("defaultCategory", val);
  };

  const handleClearAllData = () => {
    db.playlists.clear().then(() => {
      localStorage.clear();
      setSnackbarMessage("All data cleared. Refresh the page.");
      setSnackbarOpen(true);
    });
  };

  const handleAddBuiltInPlaylist = (playlist) => {
    setLoadingPlaylist(playlist.name);
    fetch(playlist.url)
      .then((res) => res.text())
      .then((rawData) => {
        const playlistData = parser.parse(rawData).items;
        if (playlistData.length === 0) {
          setAlertMessage({ title: "No data", message: "No channels found in this playlist." });
          return;
        }
        db.playlists
          .where("name")
          .equalsIgnoreCase(playlist.name)
          .count()
          .then((count) => {
            if (count === 0) {
              db.playlists.add({ name: playlist.name, data: playlistData }).then(() => {
                setSelectedPlaylistName(playlist.name);
                setSnackbarMessage(`"${playlist.name}" added successfully!`);
                setSnackbarOpen(true);
              });
            } else {
              setAlertMessage({ title: "Already exists", message: `"${playlist.name}" is already in your playlists.` });
            }
          });
      })
      .catch(() => {
        setAlertMessage({ title: "Error", message: `Failed to load "${playlist.name}". Check your connection.` });
      })
      .finally(() => {
        setLoadingPlaylist(null);
      });
  };

  return (
    <Page title="Settings">
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 1 }}>

        {/* Built-in Playlists */}
        <List
          subheader={
            <ListSubheader component="div">Built-in Playlists</ListSubheader>
          }
        >
          {BUILT_IN_PLAYLISTS.map((playlist) => (
            <ListItem key={playlist.name}>
              <ListItemText
                primary={playlist.name}
                secondary={playlist.url}
                secondaryTypographyProps={{ noWrap: true, style: { maxWidth: 300 } }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  loadingPlaylist === playlist.name ? (
                    <CircularProgress size={16} />
                  ) : (
                    <DownloadIcon />
                  )
                }
                disabled={loadingPlaylist === playlist.name}
                onClick={() => handleAddBuiltInPlaylist(playlist)}
              >
                Add
              </Button>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Playback */}
        <List
          subheader={
            <ListSubheader component="div">Playback</ListSubheader>
          }
        >
          <ListItem>
            <ListItemText
              primary="Autoplay"
              secondary="Automatically start playing when a channel is selected"
            />
            <Switch
              edge="end"
              checked={autoplay}
              onChange={handleAutoplayToggle}
              inputProps={{ "aria-label": "autoplay toggle" }}
            />
          </ListItem>
        </List>

        <Divider />

        {/* General */}
        <List
          subheader={
            <ListSubheader component="div">General</ListSubheader>
          }
        >
          <ListItem>
            <ListItemText
              primary="Default category"
              secondary="Category shown on app start"
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={defaultCategory}
                onChange={handleDefaultCategoryChange}
              >
                <MenuItem value="All channels">All channels</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        </List>

        <Divider />

        {/* Data */}
        <List
          subheader={
            <ListSubheader component="div">Data</ListSubheader>
          }
        >
          <ListItem>
            <ListItemText
              primary="Clear all data"
              secondary="Delete all playlists and reset app settings"
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteSweepIcon />}
              onClick={handleClearAllData}
            >
              Clear
            </Button>
          </ListItem>
        </List>

        <Divider />

        {/* About */}
        <List
          subheader={
            <ListSubheader component="div">About</ListSubheader>
          }
        >
          <ListItem>
            <ListItemText primary="App" secondary="World IPTV" />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Developed by"
              secondary={
                <a
                  href="https://blackglobe.qzz.io/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit" }}
                >
                  Black Globe
                </a>
              }
            />
          </ListItem>
        </List>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Page>
  );
}
