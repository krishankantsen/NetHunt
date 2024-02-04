import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Close,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const user=useSelector((state)=>state.user)
  const username=`${user.firstName} ${user.lastName}`
  const pic=user.picturePath
  const isLiked = Boolean(likes[loggedInUserId]);
  const [newcomment ,setNewcomment]=useState("");
  const likeCount = Object.keys(likes).length;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const patchLike = async () => {
    const response = await fetch(`https://nethunt-admin.onrender.com/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId  }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
  const handleComment=async()=>{
    const response=await fetch(`https://nethunt-admin.onrender.com/posts/${postId}/comment`,{
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId,commentbody:newcomment ,uname:username,picture:pic}),
     
    })
    const updatedPost=await response.json();
    dispatch(setPost({ post: updatedPost }));
    setNewcomment("")
  }

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`https://nethunt-admin.onrender.com/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton
              onClick={() => {
                setIsComments(!isComments);
              }}
            >
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          zIndex="10"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
        >
          <Box
            width="400px"
            height="500px"
            sx={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              p: 2,
              gap: 2,
            }}
          >
            <IconButton gap={2} onClick={() => setIsComments(!isComments)}>
            <Typography fontWeight={"bold"} variant="h5">Comments</Typography> <Close /> 
            </IconButton>
            <Box sx={{ height: "60%", overflow: "auto" }}>
            {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Box display={"flex"} gap={1}><img src=`https://nethunt-admin.onrender.com/${comment.profilePic}` alt="profile_pic" width={"30px"} height={"30px"}/>
              <Typography fontWeight={"bold"}>{comment.name}</Typography></Box>
              <Typography sx={{ color:main, m: "0.5rem 0", pl: "1rem" }}>
                {comment.commentBody}
              </Typography>
              
            </Box>
          ))}
            </Box>

            <Divider />
           
            <Box sx={{display:"flex",gap:2,alignItems:"center",justifyContent:"space-between"}}>
            <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setNewcomment(e.target.value)}
          value={newcomment}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "10px",
            padding: "1rem 1rem",
            height:"20px"
          }}
        />
              <Button variant="contained" onClick={handleComment}>Post</Button>
            </Box>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
