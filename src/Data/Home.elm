module Data.Home exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

home = article [ class "article" ]
    [ h1 [ class "article-title" ]
        [ a [ href "" ]
            [ text "WIP" ]
        ]
    , p [ class "article-meta" ]
        [ text "Written by " , a [ href "#" ]
            [ text "Rohin" ]
        ]
    , p [ class "text-lead" ]
        [ text "" ]
    , p []
        [ text "" ]
    ]


