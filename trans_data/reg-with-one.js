// 1. get one status
// Request
var GetStatus = {
    type : "GetStatus",
    content : "a-128|null"
};
// Response
var Status = {
    type : "Status",
    content : "error|unreachable|not_authed|not_ready|ready"
};

// 2. set Addr
// Request
var SetSecretAddress = {
    type : "SetSecretAddress",
    content : "a-128"
};
// Response with Status