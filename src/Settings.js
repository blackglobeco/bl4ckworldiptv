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
import DownloadingIcon from "@mui/icons-material/Downloading";
// Others
import parser from "iptv-playlist-parser";
import { GlobalContext } from "./App";
import db from "./config/dexie";

const BUILT_IN_PLAYLISTS = [
  { name: "🌍 Worldwide", url: "https://iptv-org.github.io/iptv/index.m3u" },
  { name: "🖥️ Samsung TV Plus", url: "https://iptv-org.github.io/iptv/sources/us_samsung.m3u" },
  { name: "🖥️ Cineverse TV", url: "https://iptv-org.github.io/iptv/sources/us_cineversetv.m3u" },
  { name: "🖥️ The Roku Channel", url: "https://iptv-org.github.io/iptv/sources/us_roku.m3u" },
  { name: "🖥️ Vizio TV", url: "https://iptv-org.github.io/iptv/sources/us_vizio.m3u" },
  { name: "🖥️ Fire TV", url: "https://iptv-org.github.io/iptv/sources/us_firetv.m3u" },
  { name: "🖥️ Pluto TV", url: "https://iptv-org.github.io/iptv/sources/us_pluto.m3u" },
  { name: "🖥️ Distro TV", url: "https://iptv-org.github.io/iptv/sources/us_distro.m3u" },
  { name: "🖥️ Glewed TV", url: "https://iptv-org.github.io/iptv/sources/us_glewedtv.m3u" },
  { name: "🖥️ Klowd TV", url: "https://iptv-org.github.io/iptv/sources/us_klowdtv.m3u" },
  { name: "🖥️ Xumo TV", url: "https://iptv-org.github.io/iptv/sources/us_xumo.m3u" },
  { name: "🖥️ Tubi TV", url: "https://iptv-org.github.io/iptv/sources/us_tubi.m3u" },
  { name: "🖥️ Plex TV", url: "https://iptv-org.github.io/iptv/sources/us_plex.m3u" },
  { name: "🖥️ Malimar TV", url: "https://iptv-org.github.io/iptv/sources/us_malimartv.m3u" },
  { name: "🖥️ Canela TV", url: "https://iptv-org.github.io/iptv/sources/us_canelatv.m3u" },
  { name: "🖥️ Uplynk", url: "https://iptv-org.github.io/iptv/sources/us_uplynk.m3u" },
  { name: "🇦🇫 Afghanistan", url: "https://iptv-org.github.io/iptv/countries/af.m3u" },
  { name: "🇦🇱 Albania", url: "https://iptv-org.github.io/iptv/countries/al.m3u" },
  { name: "🇩🇿 Algeria", url: "https://iptv-org.github.io/iptv/countries/dz.m3u" },
  { name: "🇦🇩 Andorra", url: "https://iptv-org.github.io/iptv/countries/ad.m3u" },
  { name: "🇦🇴 Angola", url: "https://iptv-org.github.io/iptv/countries/ao.m3u" },
  { name: "🇦🇷 Argentina", url: "https://iptv-org.github.io/iptv/countries/ar.m3u" },
  { name: "🇦🇲 Armenia", url: "https://iptv-org.github.io/iptv/countries/am.m3u" },
  { name: "🇦🇼 Aruba", url: "https://iptv-org.github.io/iptv/countries/aw.m3u" },
  { name: "🇦🇺 Australia", url: "https://iptv-org.github.io/iptv/countries/au.m3u" },
  { name: "🇦🇹 Austria", url: "https://iptv-org.github.io/iptv/countries/at.m3u" },
  { name: "🇦🇿 Azerbaijan", url: "https://iptv-org.github.io/iptv/countries/az.m3u" },
  { name: "🇧🇸 Bahamas", url: "https://iptv-org.github.io/iptv/countries/bs.m3u" },
  { name: "🇧🇭 Bahrain", url: "https://iptv-org.github.io/iptv/countries/bh.m3u" },
  { name: "🇧🇩 Bangladesh", url: "https://iptv-org.github.io/iptv/countries/bd.m3u" },
  { name: "🇧🇧 Barbados", url: "https://iptv-org.github.io/iptv/countries/bb.m3u" },
  { name: "🇧🇾 Belarus", url: "https://iptv-org.github.io/iptv/countries/by.m3u" },
  { name: "🇧🇪 Belgium", url: "https://iptv-org.github.io/iptv/countries/be.m3u" },
  { name: "🇧🇯 Benin", url: "https://iptv-org.github.io/iptv/countries/bj.m3u" },
  { name: "🇧🇲 Bermuda", url: "https://iptv-org.github.io/iptv/countries/bm.m3u" },
  { name: "🇧🇹 Bhutan", url: "https://iptv-org.github.io/iptv/countries/bt.m3u" },
  { name: "🇧🇴 Bolivia", url: "https://iptv-org.github.io/iptv/countries/bo.m3u" },
  { name: "🇧🇶 Bonaire", url: "https://iptv-org.github.io/iptv/countries/bq.m3u" },
  { name: "🇧🇦 Bosnia and Herzegovina", url: "https://iptv-org.github.io/iptv/countries/ba.m3u" },
  { name: "🇧🇷 Brazil", url: "https://iptv-org.github.io/iptv/countries/br.m3u" },
  { name: "🇻🇬 British Virgin Islands", url: "https://iptv-org.github.io/iptv/countries/vg.m3u" },
  { name: "🇧🇳 Brunei", url: "https://iptv-org.github.io/iptv/countries/bn.m3u" },
  { name: "🇧🇬 Bulgaria", url: "https://iptv-org.github.io/iptv/countries/bg.m3u" },
  { name: "🇧🇫 Burkina Faso", url: "https://iptv-org.github.io/iptv/countries/bf.m3u" },
  { name: "🇰🇭 Cambodia", url: "https://iptv-org.github.io/iptv/countries/kh.m3u" },
  { name: "🇨🇲 Cameroon", url: "https://iptv-org.github.io/iptv/countries/cm.m3u" },
  { name: "🇨🇦 Canada", url: "https://iptv-org.github.io/iptv/countries/ca.m3u" },
  { name: "🇨🇻 Cape Verde", url: "https://iptv-org.github.io/iptv/countries/cv.m3u" },
  { name: "🇹🇩 Chad", url: "https://iptv-org.github.io/iptv/countries/td.m3u" },
  { name: "🇨🇱 Chile", url: "https://iptv-org.github.io/iptv/countries/cl.m3u" },
  { name: "🇨🇳 China", url: "https://iptv-org.github.io/iptv/countries/cn.m3u" },
  { name: "🇨🇴 Colombia", url: "https://iptv-org.github.io/iptv/countries/co.m3u" },
  { name: "🇨🇷 Costa Rica", url: "https://iptv-org.github.io/iptv/countries/cr.m3u" },
  { name: "🇭🇷 Croatia", url: "https://iptv-org.github.io/iptv/countries/hr.m3u" },
  { name: "🇨🇺 Cuba", url: "https://iptv-org.github.io/iptv/countries/cu.m3u" },
  { name: "🇨🇼 Curacao", url: "https://iptv-org.github.io/iptv/countries/cw.m3u" },
  { name: "🇨🇾 Cyprus", url: "https://iptv-org.github.io/iptv/countries/cy.m3u" },
  { name: "🇨🇿 Czech Republic", url: "https://iptv-org.github.io/iptv/countries/cz.m3u" },
  { name: "🇨🇩 Democratic Republic of the Congo", url: "https://iptv-org.github.io/iptv/countries/cd.m3u" },
  { name: "🇩🇰 Denmark", url: "https://iptv-org.github.io/iptv/countries/dk.m3u" },
  { name: "🇩🇯 Djibouti", url: "https://iptv-org.github.io/iptv/countries/dj.m3u" },
  { name: "🇩🇴 Dominican Republic", url: "https://iptv-org.github.io/iptv/countries/do.m3u" },
  { name: "🇪🇨 Ecuador", url: "https://iptv-org.github.io/iptv/countries/ec.m3u" },
  { name: "🇪🇬 Egypt", url: "https://iptv-org.github.io/iptv/countries/eg.m3u" },
  { name: "🇸🇻 El Salvador", url: "https://iptv-org.github.io/iptv/countries/sv.m3u" },
  { name: "🇬🇶 Equatorial Guinea", url: "https://iptv-org.github.io/iptv/countries/gq.m3u" },
  { name: "🇪🇷 Eritrea", url: "https://iptv-org.github.io/iptv/countries/er.m3u" },
  { name: "🇪🇪 Estonia", url: "https://iptv-org.github.io/iptv/countries/ee.m3u" },
  { name: "🇪🇹 Ethiopia", url: "https://iptv-org.github.io/iptv/countries/et.m3u" },
  { name: "🇫🇴 Faroe Islands", url: "https://iptv-org.github.io/iptv/countries/fo.m3u" },
  { name: "🇫🇮 Finland", url: "https://iptv-org.github.io/iptv/countries/fi.m3u" },
  { name: "🇫🇷 France", url: "https://iptv-org.github.io/iptv/countries/fr.m3u" },
  { name: "🇵🇫 French Polynesia", url: "https://iptv-org.github.io/iptv/countries/pf.m3u" },
  { name: "🇬🇦 Gabon", url: "https://iptv-org.github.io/iptv/countries/ga.m3u" },
  { name: "🇬🇲 Gambia", url: "https://iptv-org.github.io/iptv/countries/gm.m3u" },
  { name: "🇬🇪 Georgia", url: "https://iptv-org.github.io/iptv/countries/ge.m3u" },
  { name: "🇩🇪 Germany", url: "https://iptv-org.github.io/iptv/countries/de.m3u" },
  { name: "🇬🇭 Ghana", url: "https://iptv-org.github.io/iptv/countries/gh.m3u" },
  { name: "🇬🇷 Greece", url: "https://iptv-org.github.io/iptv/countries/gr.m3u" },
  { name: "🇬🇵 Guadeloupe", url: "https://iptv-org.github.io/iptv/countries/gp.m3u" },
  { name: "🇬🇺 Guam", url: "https://iptv-org.github.io/iptv/countries/gu.m3u" },
  { name: "🇬🇹 Guatemala", url: "https://iptv-org.github.io/iptv/countries/gt.m3u" },
  { name: "🇬🇬 Guernsey", url: "https://iptv-org.github.io/iptv/countries/gg.m3u" },
  { name: "🇬🇳 Guinea", url: "https://iptv-org.github.io/iptv/countries/gn.m3u" },
  { name: "🇬🇾 Guyana", url: "https://iptv-org.github.io/iptv/countries/gy.m3u" },
  { name: "🇭🇹 Haiti", url: "https://iptv-org.github.io/iptv/countries/ht.m3u" },
  { name: "🇭🇳 Honduras", url: "https://iptv-org.github.io/iptv/countries/hn.m3u" },
  { name: "🇭🇰 Hong Kong", url: "https://iptv-org.github.io/iptv/countries/hk.m3u" },
  { name: "🇭🇺 Hungary", url: "https://iptv-org.github.io/iptv/countries/hu.m3u" },
  { name: "🇮🇸 Iceland", url: "https://iptv-org.github.io/iptv/countries/is.m3u" },
  { name: "🇮🇳 India", url: "https://iptv-org.github.io/iptv/countries/in.m3u" },
  { name: "🇮🇩 Indonesia", url: "https://iptv-org.github.io/iptv/countries/id.m3u" },
  { name: "🇮🇷 Iran", url: "https://iptv-org.github.io/iptv/countries/ir.m3u" },
  { name: "🇮🇶 Iraq", url: "https://iptv-org.github.io/iptv/countries/iq.m3u" },
  { name: "🇮🇪 Ireland", url: "https://iptv-org.github.io/iptv/countries/ie.m3u" },
  { name: "🇮🇱 Israel", url: "https://iptv-org.github.io/iptv/countries/il.m3u" },
  { name: "🇮🇹 Italy", url: "https://iptv-org.github.io/iptv/countries/it.m3u" },
  { name: "🇨🇮 Ivory Coast", url: "https://iptv-org.github.io/iptv/countries/ci.m3u" },
  { name: "🇯🇲 Jamaica", url: "https://iptv-org.github.io/iptv/countries/jm.m3u" },
  { name: "🇯🇵 Japan", url: "https://iptv-org.github.io/iptv/countries/jp.m3u" },
  { name: "🇯🇴 Jordan", url: "https://iptv-org.github.io/iptv/countries/jo.m3u" },
  { name: "🇰🇿 Kazakhstan", url: "https://iptv-org.github.io/iptv/countries/kz.m3u" },
  { name: "🇰🇪 Kenya", url: "https://iptv-org.github.io/iptv/countries/ke.m3u" },
  { name: "🇽🇰 Kosovo", url: "https://iptv-org.github.io/iptv/countries/xk.m3u" },
  { name: "🇰🇼 Kuwait", url: "https://iptv-org.github.io/iptv/countries/kw.m3u" },
  { name: "🇰🇬 Kyrgyzstan", url: "https://iptv-org.github.io/iptv/countries/kg.m3u" },
  { name: "🇱🇦 Laos", url: "https://iptv-org.github.io/iptv/countries/la.m3u" },
  { name: "🇱🇻 Latvia", url: "https://iptv-org.github.io/iptv/countries/lv.m3u" },
  { name: "🇱🇧 Lebanon", url: "https://iptv-org.github.io/iptv/countries/lb.m3u" },
  { name: "🇱🇷 Liberia", url: "https://iptv-org.github.io/iptv/countries/lr.m3u" },
  { name: "🇱🇾 Libya", url: "https://iptv-org.github.io/iptv/countries/ly.m3u" },
  { name: "🇱🇮 Liechtenstein", url: "https://iptv-org.github.io/iptv/countries/li.m3u" },
  { name: "🇱🇹 Lithuania", url: "https://iptv-org.github.io/iptv/countries/lt.m3u" },
  { name: "🇱🇺 Luxembourg", url: "https://iptv-org.github.io/iptv/countries/lu.m3u" },
  { name: "🇲🇴 Macao", url: "https://iptv-org.github.io/iptv/countries/mo.m3u" },
  { name: "🇲🇾 Malaysia", url: "https://iptv-org.github.io/iptv/countries/my.m3u" },
  { name: "🇲🇻 Maldives", url: "https://iptv-org.github.io/iptv/countries/mv.m3u" },
  { name: "🇲🇱 Mali", url: "https://iptv-org.github.io/iptv/countries/ml.m3u" },
  { name: "🇲🇹 Malta", url: "https://iptv-org.github.io/iptv/countries/mt.m3u" },
  { name: "🇲🇶 Martinique", url: "https://iptv-org.github.io/iptv/countries/mq.m3u" },
  { name: "🇲🇷 Mauritania", url: "https://iptv-org.github.io/iptv/countries/mr.m3u" },
  { name: "🇲🇺 Mauritius", url: "https://iptv-org.github.io/iptv/countries/mu.m3u" },
  { name: "🇲🇽 Mexico", url: "https://iptv-org.github.io/iptv/countries/mx.m3u" },
  { name: "🇲🇩 Moldova", url: "https://iptv-org.github.io/iptv/countries/md.m3u" },
  { name: "🇲🇨 Monaco", url: "https://iptv-org.github.io/iptv/countries/mc.m3u" },
  { name: "🇲🇳 Mongolia", url: "https://iptv-org.github.io/iptv/countries/mn.m3u" },
  { name: "🇲🇪 Montenegro", url: "https://iptv-org.github.io/iptv/countries/me.m3u" },
  { name: "🇲🇦 Morocco", url: "https://iptv-org.github.io/iptv/countries/ma.m3u" },
  { name: "🇲🇿 Mozambique", url: "https://iptv-org.github.io/iptv/countries/mz.m3u" },
  { name: "🇲🇲 Myanmar", url: "https://iptv-org.github.io/iptv/countries/mm.m3u" },
  { name: "🇳🇦 Namibia", url: "https://iptv-org.github.io/iptv/countries/na.m3u" },
  { name: "🇳🇵 Nepal", url: "https://iptv-org.github.io/iptv/countries/np.m3u" },
  { name: "🇳🇱 Netherlands", url: "https://iptv-org.github.io/iptv/countries/nl.m3u" },
  { name: "🇳🇿 New Zealand", url: "https://iptv-org.github.io/iptv/countries/nz.m3u" },
  { name: "🇳🇮 Nicaragua", url: "https://iptv-org.github.io/iptv/countries/ni.m3u" },
  { name: "🇳🇪 Niger", url: "https://iptv-org.github.io/iptv/countries/ne.m3u" },
  { name: "🇳🇬 Nigeria", url: "https://iptv-org.github.io/iptv/countries/ng.m3u" },
  { name: "🇰🇵 North Korea", url: "https://iptv-org.github.io/iptv/countries/kp.m3u" },
  { name: "🇲🇰 North Macedonia", url: "https://iptv-org.github.io/iptv/countries/mk.m3u" },
  { name: "🇳🇴 Norway", url: "https://iptv-org.github.io/iptv/countries/no.m3u" },
  { name: "🇴🇲 Oman", url: "https://iptv-org.github.io/iptv/countries/om.m3u" },
  { name: "🇵🇰 Pakistan", url: "https://iptv-org.github.io/iptv/countries/pk.m3u" },
  { name: "🇵🇸 Palestine", url: "https://iptv-org.github.io/iptv/countries/ps.m3u" },
  { name: "🇵🇦 Panama", url: "https://iptv-org.github.io/iptv/countries/pa.m3u" },
  { name: "🇵🇬 Papua New Guinea", url: "https://iptv-org.github.io/iptv/countries/pg.m3u" },
  { name: "🇵🇾 Paraguay", url: "https://iptv-org.github.io/iptv/countries/py.m3u" },
  { name: "🇵🇪 Peru", url: "https://iptv-org.github.io/iptv/countries/pe.m3u" },
  { name: "🇵🇭 Philippines", url: "https://iptv-org.github.io/iptv/countries/ph.m3u" },
  { name: "🇵🇱 Poland", url: "https://iptv-org.github.io/iptv/countries/pl.m3u" },
  { name: "🇵🇹 Portugal", url: "https://iptv-org.github.io/iptv/countries/pt.m3u" },
  { name: "🇵🇷 Puerto Rico", url: "https://iptv-org.github.io/iptv/countries/pr.m3u" },
  { name: "🇶🇦 Qatar", url: "https://iptv-org.github.io/iptv/countries/qa.m3u" },
  { name: "🇨🇬 Republic of the Congo", url: "https://iptv-org.github.io/iptv/countries/cg.m3u" },
  { name: "🇷🇪 Reunion", url: "https://iptv-org.github.io/iptv/countries/re.m3u" },
  { name: "🇷🇴 Romania", url: "https://iptv-org.github.io/iptv/countries/ro.m3u" },
  { name: "🇷🇺 Russia", url: "https://iptv-org.github.io/iptv/countries/ru.m3u" },
  { name: "🇷🇼 Rwanda", url: "https://iptv-org.github.io/iptv/countries/rw.m3u" },
  { name: "🇰🇳 Saint Kitts and Nevis", url: "https://iptv-org.github.io/iptv/countries/kn.m3u" },
  { name: "🇱🇨 Saint Lucia", url: "https://iptv-org.github.io/iptv/countries/lc.m3u" },
  { name: "🇼🇸 Samoa", url: "https://iptv-org.github.io/iptv/countries/ws.m3u" },
  { name: "🇸🇲 San Marino", url: "https://iptv-org.github.io/iptv/countries/sm.m3u" },
  { name: "🇸🇦 Saudi Arabia", url: "https://iptv-org.github.io/iptv/countries/sa.m3u" },
  { name: "🇸🇳 Senegal", url: "https://iptv-org.github.io/iptv/countries/sn.m3u" },
  { name: "🇷🇸 Serbia", url: "https://iptv-org.github.io/iptv/countries/rs.m3u" },
  { name: "🇸🇬 Singapore", url: "https://iptv-org.github.io/iptv/countries/sg.m3u" },
  { name: "🇸🇽 Sint Maarten", url: "https://iptv-org.github.io/iptv/countries/sx.m3u" },
  { name: "🇸🇰 Slovakia", url: "https://iptv-org.github.io/iptv/countries/sk.m3u" },
  { name: "🇸🇮 Slovenia", url: "https://iptv-org.github.io/iptv/countries/si.m3u" },
  { name: "🇸🇴 Somalia", url: "https://iptv-org.github.io/iptv/countries/so.m3u" },
  { name: "🇿🇦 South Africa", url: "https://iptv-org.github.io/iptv/countries/za.m3u" },
  { name: "🇰🇷 South Korea", url: "https://iptv-org.github.io/iptv/countries/kr.m3u" },
  { name: "🇪🇸 Spain", url: "https://iptv-org.github.io/iptv/countries/es.m3u" },
  { name: "🇱🇰 Sri Lanka", url: "https://iptv-org.github.io/iptv/countries/lk.m3u" },
  { name: "🇸🇩 Sudan", url: "https://iptv-org.github.io/iptv/countries/sd.m3u" },
  { name: "🇸🇷 Suriname", url: "https://iptv-org.github.io/iptv/countries/sr.m3u" },
  { name: "🇸🇪 Sweden", url: "https://iptv-org.github.io/iptv/countries/se.m3u" },
  { name: "🇨🇭 Switzerland", url: "https://iptv-org.github.io/iptv/countries/ch.m3u" },
  { name: "🇸🇾 Syria", url: "https://iptv-org.github.io/iptv/countries/sy.m3u" },
  { name: "🇹🇼 Taiwan", url: "https://iptv-org.github.io/iptv/countries/tw.m3u" },
  { name: "🇹🇯 Tajikistan", url: "https://iptv-org.github.io/iptv/countries/tj.m3u" },
  { name: "🇹🇿 Tanzania", url: "https://iptv-org.github.io/iptv/countries/tz.m3u" },
  { name: "🇹🇭 Thailand", url: "https://iptv-org.github.io/iptv/countries/th.m3u" },
  { name: "🇹🇬 Togo", url: "https://iptv-org.github.io/iptv/countries/tg.m3u" },
  { name: "🇹🇹 Trinidad and Tobago", url: "https://iptv-org.github.io/iptv/countries/tt.m3u" },
  { name: "🇹🇳 Tunisia", url: "https://iptv-org.github.io/iptv/countries/tn.m3u" },
  { name: "🇹🇷 Turkiye", url: "https://iptv-org.github.io/iptv/countries/tr.m3u" },
  { name: "🇹🇲 Turkmenistan", url: "https://iptv-org.github.io/iptv/countries/tm.m3u" },
  { name: "🇻🇮 U.S. Virgin Islands", url: "https://iptv-org.github.io/iptv/countries/vi.m3u" },
  { name: "🇺🇬 Uganda", url: "https://iptv-org.github.io/iptv/countries/ug.m3u" },
  { name: "🇺🇦 Ukraine", url: "https://iptv-org.github.io/iptv/countries/ua.m3u" },
  { name: "🇦🇪 United Arab Emirates", url: "https://iptv-org.github.io/iptv/countries/ae.m3u" },
  { name: "🇬🇧 United Kingdom", url: "https://iptv-org.github.io/iptv/countries/uk.m3u" },
  { name: "🇺🇸 United States", url: "https://iptv-org.github.io/iptv/countries/us.m3u" },
  { name: "🇺🇾 Uruguay", url: "https://iptv-org.github.io/iptv/countries/uy.m3u" },
  { name: "🇺🇿 Uzbekistan", url: "https://iptv-org.github.io/iptv/countries/uz.m3u" },
  { name: "🇻🇦 Vatican City", url: "https://iptv-org.github.io/iptv/countries/va.m3u" },
  { name: "🇻🇪 Venezuela", url: "https://iptv-org.github.io/iptv/countries/ve.m3u" },
  { name: "🇻🇳 Vietnam", url: "https://iptv-org.github.io/iptv/countries/vn.m3u" },
  { name: "🇪🇭 Western Sahara", url: "https://iptv-org.github.io/iptv/countries/eh.m3u" },
  { name: "🇾🇪 Yemen", url: "https://iptv-org.github.io/iptv/countries/ye.m3u" },
  { name: "🇿🇼 Zimbabwe", url: "https://iptv-org.github.io/iptv/countries/zw.m3u" },
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
  const [addingAll, setAddingAll] = useState(false);
  const [addAllProgress, setAddAllProgress] = useState(0);

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

  const handleAddAll = async () => {
    setAddingAll(true);
    setAddAllProgress(0);
    let added = 0;
    for (let i = 0; i < BUILT_IN_PLAYLISTS.length; i++) {
      const playlist = BUILT_IN_PLAYLISTS[i];
      try {
        const res = await fetch(playlist.url);
        const rawData = await res.text();
        const playlistData = parser.parse(rawData).items;
        if (playlistData.length > 0) {
          const count = await db.playlists.where("name").equalsIgnoreCase(playlist.name).count();
          if (count === 0) {
            await db.playlists.add({ name: playlist.name, data: playlistData });
            added++;
          }
        }
      } catch (e) {
        // skip failed
      }
      setAddAllProgress(i + 1);
    }
    setAddingAll(false);
    setSnackbarMessage(`Done! Added ${added} playlist(s).`);
    setSnackbarOpen(true);
  };

  return (
    <Page title="Settings">
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 1 }}>

        {/* Built-in Playlists */}
        <List
          subheader={
            <ListSubheader component="div" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
              Built-in Playlists
              <Button
                size="small"
                variant="outlined"
                startIcon={addingAll ? <CircularProgress size={14} /> : <DownloadingIcon />}
                disabled={addingAll}
                onClick={handleAddAll}
                sx={{ ml: 2, textTransform: "none", fontSize: "0.75rem" }}
              >
                {addingAll ? `${addAllProgress}/${BUILT_IN_PLAYLISTS.length}` : "Add All"}
              </Button>
            </ListSubheader>
          }
        >
          {BUILT_IN_PLAYLISTS.map((playlist) => (
            <ListItem key={playlist.name}>
              <ListItemText
                primary={playlist.name}
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
            <ListItemText primary="App" secondary="Black IPTV" />
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
