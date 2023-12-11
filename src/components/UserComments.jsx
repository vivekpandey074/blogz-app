import React from "react";
import defaultUser from "../assets/defaultUser.png";

export default function UserComments({ name, body, createdAt, msg }) {
  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="comments-list">
            <div className="media">
              {msg ? (
                <h4>{msg}</h4>
              ) : (
                <>
                  <div className="media-left">
                    <img
                      src={defaultUser}
                      alt="User"
                      className="rounded-circle"
                    />
                  </div>
                  <div className="media-body">
                    <h3 className="text-start media-heading user_name">
                      {name} <small>{createdAt?.toDate().toDateString()}</small>
                    </h3>
                    <p className="text-start">{body}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
