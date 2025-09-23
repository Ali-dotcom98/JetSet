/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./views/**/*.html", "./views/**/*.js"],
  theme: {
    extend: {
      colors:{
        primary:'#FF6363',
        secondary:{
            100:'#E2E2D5',
            200:'#888883',
        },
        bookmark:
        {
          "Purple":"#5267DF",
          "red":"#FA5959",
          "blue":"#242A45",
          "grey":"#91914A2",
          "white":"#f7f7f7,",
          "Light":"#667085",
          "Dark":"#1d2939"
        },
      },
      fontFamily:
      {
        body:['Nunito'],
        New:['Time'],
        Popins:["poppins","sans-srif"],
      },
      container:
      {
        center:true,
        padding: '1rem',
        screens:
        {
          lg:"1124px",
          xl:"1124px",
          "2xl":"1124px",
        },
      },
      animation: {
        'slide-in-down': 'slide-in-down 0.5s ease-in-out',
      },
      keyframes: {
        "slide-in-down": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(0, -100%, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
      }


    },
    safelist: ['animate-[fade-in_1s_ease-in-out]', 'animate-[fade-in-down_1s_ease-in-out]']
  },
  plugins: [],
}


