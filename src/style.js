const theme = {
  color: {
    white: "white",
    asylaBlue: "#4BA9E0", 
    grey: "#e0e0e0",
    black: "#292929"
  }
};

const style = {
  '@global': {
    "html, body": {
      position: 'relative',
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
    'html, body, #root': {
      height: '100%'
    },
    '#form': {
      overflow: 'hidden'
    },
    code: {
      fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace'
    },
    '.switch-wrapper': {
      position: 'relative'
    }
  },
  app: {
    height: '100%',
    background: theme.color.asylaBlue,
    '& .table': {
      display: 'table',
      height: '100%',
      width: '100%'
    },
    '& .container': {
      margin: '0 auto',
      display: 'table-row',
      height: '100%'
    },
    '& .content': {
      display: 'table-cell',
      'vertical-align': 'middle'
    },
    '& .logo': {
      height: '25px',
      margin: '1.5em auto',
      display: 'block'
    }
  },
  github: {
    //extend: 'button',
    background: theme.color.black,
    color: theme.color.white
  },
  button: {
    margin: "1em 0",
    float: "right",
    fontWeight: "bold",
    background: theme.color.asylaBlue,
    color: theme.color.white,
    '&:hover': {
      color: theme.color.black,
      background: theme.color.grey,
      '& svg g': {
        fill: theme.color.black,
      }
    },
    '& svg g': {
      fill: theme.color.white,
    }
  },
  field: {
    width: "100%",
    margin: "15px 0",
    color: theme.color.asylaBlue
  },
  loginform: {
    display: 'inline-block',
    width: '100%',
    'text-align': 'center',
    "& section": {
      overflow: 'hidden'
    }
  },
  link: {
    marginTop: '1em',
    fontSize: '13px',
    color: theme.color.asylaBlue
  },
  paper: {
    padding: '3em 2em',
    width: '400px',
    margin: '0 auto'
  },
  spinner: {
    width: '8em',
    height: '8em',
    margin: '20px auto',
    fontSize: '6px',
    borderTop: '.8em solid rgba(0,0,0, 0.2)',
    borderRight: '.8em solid rgba(0,0,0, 0.2)',
    borderBottom: '.8em solid rgba(0,0,0, 0.2)',
    borderLeft: '.8em solid #000000',
    '&:after': {
      width: '8em',
      height: '8em'
    }
  }
}

export default style