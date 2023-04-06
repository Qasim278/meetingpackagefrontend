import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Divider,
  Box,
  Grid,
} from "@mui/material";
import Switch from "react-switch";
import Select from "react-select";

interface HotelData {
  hotelid: string;
  hotelname: string;
  channels: Array<{
    channelid: string;
    channelname: string;
    visibility: number;
  }>;
}

export default function App() {
  const [state, setstate] = useState<HotelData | null>(null);
  const [hotelData, sethotelData] = useState<HotelData[]>([]);
  const [dark, setdark] = useState(false);

  function getHotels() {
    var request: RequestInit = {
      method: "Get",
      redirect: "follow",
      mode: "cors",
    };

    fetch("https://meetingpackage.herokuapp.com/api/Hotel", request)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.length);
        sethotelData(result);
        setstate(result[0]);
      })
      .catch((error) => console.log("error", error));
  }

  function updateToggle(hotelid: string, channelid: string, toggle: number) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var request: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        hotel_id: hotelid,
        channel_id: channelid,
        visibility: toggle,
      }),
      redirect: "follow",
    };

    fetch("https://meetingpackage.herokuapp.com/api/update_visibility", request)
      .then((response) => response.json())
      .then((result) => {
        console.log(result, "response");
        sethotelData(result);
        let filteredarray = result.filter(
          (item: any) => item.hotelid == state?.hotelid
        );
        setstate(filteredarray[0]);
      })
      .catch((error) => console.log("error", error));
  }

  useEffect(() => {
    getHotels();
  }, []);

  const SelectComponent = ({ item }: { item: any }) => {
    const [toggle, settoggle] = useState(item.visibility == 1 ? true : false);
    return (
      <Switch
        onChange={() => {
          settoggle(!toggle);
          if (state !== null) {
            updateToggle(state.hotelid, item.channelid, toggle ? 0 : 1);
          }
        }}
        checked={toggle}
        uncheckedIcon={false}
        checkedIcon={false}
        onColor={"#1a83de"}
        offColor={"#cbd5e1"}
        activeBoxShadow={"0 0 0px 0px #fff"}
        height={14}
        width={28}
      />
    );
  };

  return (
    <Box
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: dark ? "black" : "white",
        minHeight: "100%",
        paddingBottom: 50,
      }}
    >
      <Box>
        <img
          style={{
            width: 200,
            height: 40,
            paddingLeft: 30,
            paddingTop: 10,
            paddingBottom: 10,
          }}
          src="https://i.ibb.co/bBy8MNC/Screenshot-2023-04-05-220102-removebg-preview.png"
          alt="Meetingpackage.com"
        />
        <Divider style={{ background: dark ? "silver" : "grey" }} />
      </Box>
      <Box mx={20} my={15}>
        <Box
          pr={2}
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h5"
            component="h5"
            style={{
              fontWeight: "bold",
              marginBottom: 10,
              color: dark ? "white" : "black",
            }}
          >
            Channel Manager
          </Typography>

          <Box
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              style={{ marginRight: 5, color: dark ? "white" : "black" }}
            >
              Dark Mode
            </Typography>
            <Switch
              onChange={() => {
                setdark(!dark);
              }}
              checked={dark}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor={"#1a83de"}
              offColor={"#cbd5e1"}
              activeBoxShadow={"0 0 0px 0px #fff"}
              height={14}
              width={28}
            />
          </Box>
        </Box>
        <Typography
          style={{
            fontWeight: "bold",
            marginBottom: 5,
            color: dark ? "white" : "black",
          }}
        >
          Hotel
        </Typography>

        {hotelData.length > 0 && (
          <Box sx={{ flexGrow: 1, marginBottom: 2.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={8} md={4}>
                <Select
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      border: "1px solid silver",
                      "&:hover": {
                        border: "1px solid silver",
                      },
                      boxShadow: "none",
                      borderRadius: 10,
                      height: 40,
                      color: "red",
                    }),
                  }}
                  value={state}
                  onChange={(option) => {
                    setstate(option);
                  }}
                  options={hotelData}
                  isLoading={false}
                  isClearable={false}
                  isRtl={false}
                  isSearchable={false}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        <TableContainer
          sx={{
            borderRadius: 2.5,
          }}
          style={{ border: dark ? "1px solid white" : "" }}
          component={Paper}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow
                style={{ backgroundColor: dark ? "#292626" : "#F4EFEE" }}
              >
                <TableCell style={{ color: dark ? "white" : "black" }}>
                  Channel
                </TableCell>
                <TableCell
                  align="right"
                  style={{ color: dark ? "white" : "black" }}
                >
                  Visibility
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state &&
                state.channels.map((item) => {
                  return (
                    <TableRow
                      key={item?.channelid}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      style={{ backgroundColor: dark ? "black" : "white" }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ color: dark ? "white" : "black" }}
                      >
                        {item?.channelname}
                      </TableCell>

                      <TableCell
                        align="right"
                        style={{ color: dark ? "white" : "black" }}
                      >
                        <SelectComponent item={item} />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
