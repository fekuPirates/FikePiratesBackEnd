const verifyMailText = (text) => {
  return `<html
  data-editor-version="2"
  class="sg-campaigns"
  xmlns="http://www.w3.org/1999/xhtml"
>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
    />

    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />

    <style type="text/css"></style>
    <!--user entered Head Start-->

    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
      crossorigin="anonymous"
    />
  </head>

  <body>
    <div style="height: 100%; width: 100%; background-color: #f4f4f4;">
      <br /><br /><br />
      <div
        style="
          background-color: white;
          width: 90%;
          margin-left: 5%;
          text-align: center;
        "
      >
        <br /><br />
        <h3>Public Auth</h3>
        <h3><b>Verify your email address</b></h3>
        <br />
        <div style="width: 80%; margin-left: 10%; margin-bottom: 20px;">
          <p>
            Please confirm that yo want to use this as your
            <b>Public auth service</b> email address.
          </p>
        </div>
        <br />
        <a
          style="
            background-color: #184475;
            color: white;
            padding: 10px;
            border-radius: 10px;
          "
          href="${text}"
          target="_blank"
        >
          Verify my Email
        </a>
        <br />
        <br />
        <br />
        <p class="">or paste the below url in your browser</p>
        <a href="${text}">${text}</a>
        <br /><br /><br />
        <br /><br />
      </div>
    </div>
  </body>
</html>`;
};
const resetMailText = (text) => {
  return `<html
  data-editor-version="2"
  class="sg-campaigns"
  xmlns="http://www.w3.org/1999/xhtml"
>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
    />

    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />

    <style type="text/css"></style>
    <!--user entered Head Start-->

    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
      crossorigin="anonymous"
    />
  </head>

  <body>
    <div style="height: 100%; width: 100%; background-color: #f4f4f4;">
      <br /><br /><br />
      <div
        style="
          background-color: white;
          width: 90%;
          margin-left: 5%;
          text-align: center;
        "
      >
        <br /><br />
        <h3>Public Auth</h3>
        <h3><b>Reset your password</b></h3>
        <br />
        <div style="width: 80%; margin-left: 10%; margin-bottom: 20px;">
          <p>        
            <b>Public auth service change password</b>  
          </p>
        </div>
        <br />
        <a
          style="
            background-color: #184475;
            color: white;
            padding: 10px;
            border-radius: 10px;
          "
          href="${text}"
          target="_blank"
        >
          chnage my password
        </a>
        <br />
        <br />
        <br />
        <p class="">or paste the below url in your browser</p>
        <a href="${text}">${text}</a>
        <br /><br /><br />
        <br /><br />
      </div>
    </div>
  </body>
</html>`;
};

module.exports.verifyMailText = verifyMailText;
module.exports.resetMailText = resetMailText;
