import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  Typography,
  Box,
  Button,
  Rating,
  styled,
  Grid,
  Divider,
} from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import PropTypes from "prop-types";
import Confetti from "react-confetti";
import { createRating, getRating } from "../redux/actions/rateAction";

const customIcons = {
  1: {
    icon: (
      <SentimentVeryDissatisfiedIcon
        color="error"
        sx={{ fontSize: "2.5rem" }}
      />
    ),
    label: "Very Dissatisfied",
  },
  2: {
    icon: (
      <SentimentDissatisfiedIcon color="error" sx={{ fontSize: "2.5rem" }} />
    ),
    label: "Dissatisfied",
  },
  3: {
    icon: (
      <SentimentSatisfiedIcon color="warning" sx={{ fontSize: "2.5rem" }} />
    ),
    label: "Neutral",
  },
  4: {
    icon: (
      <SentimentSatisfiedAltIcon color="success" sx={{ fontSize: "2.5rem" }} />
    ),
    label: "Satisfied",
  },
  5: {
    icon: (
      <SentimentVerySatisfiedIcon color="success" sx={{ fontSize: "2.5rem" }} />
    ),
    label: "Very Satisfied",
  },
};
const customRecIcons = {
  1: {
    icon: (
      <SentimentVeryDissatisfiedIcon
        color="error"
        sx={{ fontSize: "1.5rem" }}
      />
    ),
    label: "Very Dissatisfied",
  },
  2: {
    icon: (
      <SentimentDissatisfiedIcon color="error" sx={{ fontSize: "1.5rem" }} />
    ),
    label: "Dissatisfied",
  },
  3: {
    icon: (
      <SentimentSatisfiedIcon color="warning" sx={{ fontSize: "1.5rem" }} />
    ),
    label: "Neutral",
  },
  4: {
    icon: (
      <SentimentSatisfiedAltIcon color="success" sx={{ fontSize: "1.5rem" }} />
    ),
    label: "Satisfied",
  },
  5: {
    icon: (
      <SentimentVerySatisfiedIcon color="success" sx={{ fontSize: "1.5rem" }} />
    ),
    label: "Very Satisfied",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}
function IconRecContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customRecIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

function ReviewPage() {
  const dispatch = useDispatch();
  const { auth, rates } = useSelector((state) => state);
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");
  const [showConfetti, setShowConfetti] = React.useState(false);

  const StyledRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
      color: "#8C8C8C",
    },
  }));

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  useEffect(() => {
    dispatch(getRating(auth.token));
  }, []);

  const handleRatingChange = (event, value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rating) return;
    await dispatch(
      createRating({ value: parseInt(rating), comment }, auth.token)
    );
    setShowConfetti(true);
    await dispatch(getRating(auth.token));
    setRating(0);
    setComment("");
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth + 100}
          height={window.innerHeight + 100}
          recycle={false}
          numberOfPieces={500}
          wind={0.01}
          gravity={0.2}
        />
      )}
      <h1 className="pt-5 text-6xl uppercase mb-10 font-bold from-indigo-600 via-pink-500 to-violet-600 bg-gradient-to-b bg-clip-text text-transparent">
        Rating
      </h1>
      <Typography
        className="dark:text-white"
        variant="body1"
        component="p"
        gutterBottom
        sx={{ p: 2, textShadow: "0 0 5px rgba(255, 255, 255, 0.5)" }}
      >
        Thank you for using our app! We value your feedback and would love to
        hear about your experience. Please take a moment to rate the app and
        leave your comments below.
      </Typography>
      <Grid
        container
        justifyContent="space-between"
        sx={{ padding: "4rem" }}
        spacing={5}
      >
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Typography
            className="dark:text-white"
            variant="h6"
            component="h1"
            gutterBottom
          >
            Recommendations
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          {rates && rates.length > 0 ? (
            rates.map((item) => (
              <div
                key={item._id}
                className="card pt-3 shadow-md dark:bg-neutral-900 dark:text-white p-5 m-5 rounded-md"
              >
                <div className="flex justify-between pb-5 pt-5">
                  <div className="header-card flex space-x-5">
                    <img
                      className="medium-avatar"
                      src={item.user.avatar}
                      alt="avatar"
                      referrerPolicy="no-referrer"
                    />
                    <Typography
                      className="dark:text-white"
                      variant="subtitle1"
                      component="h2"
                      gutterBottom
                    >
                      {item.user.username}
                    </Typography>
                  </div>
                  <StyledRating
                    name="highlight-selected-only"
                    value={item.value}
                    IconContainerComponent={IconRecContainer}
                    getLabelText={(value) => customRecIcons[value].label}
                    highlightSelectedOnly
                  />
                </div>
                <Divider
                  sx={{
                    marginBottom: "15px",
                    background: "#626262",
                    opacity: "0.2",
                  }}
                />
                <Typography
                  className="dark:text-white"
                  variant="body2"
                  component="p"
                >
                  {item.comment}
                </Typography>
              </div>
            ))
          ) : (
            <h1>No Review, Be the first one to review!</h1>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Typography
            className="dark:text-white"
            variant="h6"
            component="h1"
            gutterBottom
          >
            Review
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography
                className="dark:text-white"
                component="legend"
                sx={{ p: 2 }}
              >
                Rating
              </Typography>
              <StyledRating
                name="highlight-selected-only"
                value={rating}
                onChange={handleRatingChange}
                IconContainerComponent={IconContainer}
                getLabelText={(value) => customIcons[value].label}
                highlightSelectedOnly
              />
            </Box>
            <FormControl fullWidth>
              <Typography className="dark:text-white" component="legend">
                Comment
              </Typography>
              <textarea
                className="mb-4 w-full min-h-32 px-2 py-1 dark:text-white dark:bg-neutral-800"
                value={comment}
                onChange={handleCommentChange}
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="mt-4"
            >
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default ReviewPage;
