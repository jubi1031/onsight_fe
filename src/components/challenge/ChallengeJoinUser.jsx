import React from 'react';

const ChallengeJoinUser = (props) => {
  const apiUrl = process.env.REACT_APP_BACK_URL;
  const { user_name, thumbnail } = {
    ...props,
  };
  const entry_img = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    background: '#f2f4f8',
    borderRadius: '50%',
    overflow: 'hidden',
  };
  const img = {
    width: '100%',
    height: '100%',
    border: '0',
    // filter: "invert(0.6)",
  };

  const entry = {
    margin: '0 0 0 10px',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#000',
  };

  return (
    <li>
      <div style={entry_img}>
        <img
          style={img}
          src={
            thumbnail == null ? '/img/joinuser.png' : `${apiUrl}${thumbnail}`
          }
          alt=""
        />
      </div>
      <em style={entry}>{user_name}</em>
    </li>
  );
};

export default ChallengeJoinUser;
