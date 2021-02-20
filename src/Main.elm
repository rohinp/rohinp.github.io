module Main exposing (main)

{-| -}

import Element exposing (..)
import Element.Background as Background
import Element.Font as Font
import Element.Input
import Element.Lazy
import OneDark exposing (..)


main =
    Element.layout
        [ Background.color OneDark.black
        , Font.color OneDark.white
        , Font.regular
        , Font.size 32
        , Font.family
            [ Font.external
                { url = "https://fonts.googleapis.com/earlyaccess/notosansjp.css"
                , name = "Noto Sans JP"
                }
            , Font.sansSerif
            ]
        ]
    <|
        column
            [ centerX, centerY ]
            [ el
                [ Font.color OneDark.white ]
                (text "WIP")
            , el
                [ Font.color OneDark.black ]
                (text "Bolg Page")
            , el
                [ Font.color OneDark.green ]
                (text "FP")
            , el
                [ Font.color OneDark.cyan ]
                (text "Scala 3")
            , el
                [ Font.color OneDark.darkRed ]
                (text "JVM")
            , el
                [ Font.color OneDark.lightRed ]
                (text "Concurrency")
            , el
                [ Font.color OneDark.darkYellow ]
                (text "TyDD")
            , el
                [ Font.color OneDark.lightYellow ]
                (text "Comming Soon!")
            , el
                [ Font.color OneDark.commentGrey ]
                (text "Staey tuned for - Lot's of fun!!")
            ]