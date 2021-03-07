module Main exposing (main)

{-| -}

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Url
import Data.Home exposing (home)

main : Program () Model Msg
main =
  Browser.application
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    , onUrlChange = UrlChanged
    , onUrlRequest = LinkClicked
    }

-- MODEL


type alias Model =
  { key : Nav.Key
  , url : Url.Url
  }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
  ( Model key url, Cmd.none )



-- UPDATE


type Msg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    LinkClicked urlRequest ->
      case urlRequest of
        Browser.Internal url ->
          ( model, Nav.pushUrl model.key (Url.toString url) )

        Browser.External href ->
          ( model, Nav.load href )

    UrlChanged url ->
      ( { model | url = url }
      , Cmd.none
      )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
  { title = "URL Interceptor"
  , body =
      [ div [class "row site"] [
          div [class "sm-12 md-9 col"] [
            div [class "paper"] [ 
              div [ class "row flex-center child-borders" ]
                  [ 
                      a [ class "paper-btn margin", href "/home" ] [ text "Home" ], 
                      a [ class "paper-btn margin", href "/resume" ] [ text "Resume" ], 
                      a [ class "paper-btn margin", href "/about/" ] [ text "About" ], 
                      a [ href "https://github.com/rohinp", target "_blank", class "paper-btn margin" ] [ text "Github" ]
                  ]
                  , div [class "section", style "text-align" "center"] [home]
              ]
            ],
            div [class "sm-12 md-3 col sidebar"] [
              div [ class "paper" ] [ 
                h3 [ class "sidebar-title", style "text-align" "center" ] [ text "Listings" ], 
                div [ class "row" ] [ 
                    div [ class "collapsible full-width" ] [ 
                        input [ id "collapsible-components", type_ "radio", name "collapsible" ] [], 
                        label [ for "collapsible-components" ] [ text "TDD in Scala 3" ], 
                        div [ class "collapsible-body" ] [ 
                            ul [] [ 
                                li [] [ a [ href "/home" ] [ text "compiletime package" ]], 
                                li [] [ a [ href "/home" ] [ text "Abstract type member" ]], 
                                li [] [ a [ href "/home" ] [ text "Dependent data type" ]], 
                                li [] [ a [ href "/home" ] [ text "Dependent Function type" ]], 
                                li [] [ a [ href "/home" ] [ text "Natural numbers" ]]
                            ]
                                
                        ]
                    ],
                    div [ class "collapsible full-width" ] [
                        input [ id "collapsible-components", type_ "radio", name "collapsible" ] [], 
                        label [ for "collapsible-components" ] [ text "Concurrency - Project Loom" ], 
                        div [ class "collapsible-body" ] [ 
                            ul [] [ 
                                li [] [ a [ href "/home" ] [ text "Fiber Basics" ]], 
                                li [] [ a [ href "/home" ] [ text "Continuations" ]], 
                                li [] [ a [ href "/home" ] [ text "Syncronization" ]], 
                                li [] [ a [ href "/home" ] [ text "Creating an IO" ]], 
                                li [] [ a [ href "/home" ] [ text "more to come" ]]
                            ]
                                
                        ]
                    ],
                    div [ class "collapsible full-width" ] [
                        input [ id "collapsible-components", type_ "radio", name "collapsible" ] [], 
                        label [ for "collapsible-components" ] [ text "FP in scala 3" ], 
                        div [ class "collapsible-body" ] [ 
                            ul [] [ 
                                li [] [ a [ href "/home" ] [ text "Function composition" ]], 
                                li [] [ a [ href "/home" ] [ text "ADT" ]], 
                                li [] [ a [ href "/home" ] [ text "Type classes" ]], 
                                li [] [ a [ href "/home" ] [ text "Functors" ]], 
                                li [] [ a [ href "/home" ] [ text "Applicative" ]],
                                li [] [ a [ href "/home" ] [ text "Monad" ]],
                                li [] [ a [ href "/home" ] [ text "Monad Transformers" ]],
                                li [] [ a [ href "/home" ] [ text "More to come..." ]]
                            ]
                                
                        ]
                    ]
                ]
            ]
        ]
      ]
    ]
  }
