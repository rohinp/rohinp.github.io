module data.blog exposing (..)

type Blog = {
        title:String,
        introduction:List (Html msg),
        body:List (Html msg),
        footter:List (Html msg),
        notes:List (Html msg),
        next:List (Html msg),
        previous:List (Html msg)
    }