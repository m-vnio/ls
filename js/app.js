'use strict';

var theme = () => {
  const useApp = window.dataApp;

  const useThis = {
    values: {
      systemTheme: window.matchMedia("(prefers-color-scheme: dark)"),
      themes: {
        dark: {
          "app-color-background": "#000000",
          "app-color-background-second": "#000000",
          "app-color-background-transparent": "rgb(255 255 255 / 0.1)",
          "app-color-letter": "#ffffff",
          "app-color-letter-second": "#ffffff",
          "app-color-item": "#1A1A1A",
          "app-color-item-second": "#1A1A1A",
          "app-color-item-third": "#1A1A1A",
        },
        light: {
          "app-color-background": "#F7F7F7",
          "app-color-background-second": "#FFFFFF",
          "app-color-background-transparent": "rgb(0 0 0 / 0.1)",
          "app-color-letter": "#000000",
          "app-color-letter-second": "#ffffff",
          "app-color-item": "#FFFFFF",
          "app-color-item-second": "#000000",
          "app-color-item-third": "#F7F7F7",
        },
        system: {},
        custom: {},
      },
    },
    functions: {
      systemTheme: () => {},
      updateTheme: (object) => {
        return `:root {${Object.entries(object)
          .map((entries) => `--${entries[0]} : ${entries[1]}`)
          .join("; ")}}`;
      },
    },
  };

  if (
    window.matchMedia("(prefers-color-scheme: dark)").matches ||
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    useThis.values.systemTheme.addEventListener("change", (e) => {
      if (localStorage.theme == "system") {
        const matches = e.matches ?? e.target.matches;
        const object = useThis.values.themes[matches ? "dark" : "light"];
        useApp.elements.style.app.innerHTML = [
          useThis.functions.updateTheme(object),
        ].join("; ");

        useApp.elements.meta.color.setAttribute(
          "content",
          object["app-color-background"]
        );
      }
    });
  }

  addEventListener("_theme", () => {
    if (!localStorage.getItem("theme")) localStorage.setItem("theme", "system");

    const theme = localStorage.theme;

    if (theme == "dark" || theme == "light") {
      const object = useThis.values.themes[theme];
      useApp.elements.style.app.innerHTML = [
        useThis.functions.updateTheme(object),
      ].join("; ");

      useApp.elements.meta.color.setAttribute(
        "content",
        object["app-color-background"]
      );
    }

    if (theme == "custom") {
      // return;
      // if (!localStorage.getItem("theme-custom"))
      //   localStorage.setItem(
      //     "theme-custom",
      //     JSON.stringify(useThis.values.themes.dark)
      //   );

      const object = {
        ...useThis.values.themes.dark,
        ...JSON.parse(localStorage.getItem("theme-custom")),
      };
      useApp.elements.style.app.innerHTML = [
        useThis.functions.updateTheme(object),
      ].join("; ");

      useApp.elements.meta.color.setAttribute(
        "content",
        object["app-color-background"]
      );
    }

    if (theme == "system") {
      useThis.values.systemTheme.dispatchEvent(
        useApp.values.customEvents.change
      );
    }
  });

  return document.createTextNode("");
};

var routesUser = (page = "", ...parameters) => {
  const $node = document.createTextNode("");

  const userAuth = new Promise((resolve, reject) => {
    if (!localStorage.getItem("user-auth")) {
      fetch("https://random-data-api.com/api/users/random_user")
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("user-auth", JSON.stringify(data));
          resolve(data);
        });
    }

    resolve(JSON.parse(localStorage.getItem("user-auth")));
  });

  userAuth.then((data) => {
    window.dataApp.user.data = data;
    return $node.replaceWith(page(...parameters));
  });

  // auth().then((result) => {
  //   if (result?.status) {
  //     Cookie.set(useApp.auth, result.token, {
  //       lifetime: 60 * 60 * 24 * 7,
  //     });
  //     return $node.replaceWith(page(...parameters));
  //   }

  //   location.hash = "/login";
  // });

  return $node;
};

var inicio = () => {
  const useApp = window.dataApp;

  const $element = createNodeElement(`
        <div class="div_Ph0Tbeb">
             
            <div class="div_iryhnI">

                <button id="buttonCreate" href="#" class="a_O7AGEKn">
                
                    <span class="flex-1">Crear</span>
                    <small class="app-square-var d-flex-center">
                        ${useApp.svgIcon("fi fi-rr-arrow-right")}
                    </small>

                </button>
                <form id="form" class="form_7rp3jB2" autocomplete="off">

                    <input type="text" name="code" placeholder="codigo" autocomplete="off">
                    <button class="app-square-var d-flex-center">
                        ${useApp.svgIcon("fi fi-rr-arrow-right")}
                    </button>

                </form>

            </div>

        </div>
    `);

  const $elements = createObjectElement(
    $element.querySelectorAll("[id]"),
    "id",
    true
  );

  $elements.buttonCreate.addEventListener("click", () => {
    location.hash = `/e/${Date.now()}`;
  });

  $elements.form.addEventListener("submit", (e) => {
    e.preventDefault();

    location.hash = `/r/${$elements.form.code.value.trim()}`;
  });

  return $element;
};

var componentVideo = (useParams) => {
  const useApp = window.dataApp;
  const useThis = {
    elements: {
      fullscreen: null,
    },
    values: {
      dblclick: {
        diff: 0,
        time: 0,
      },
      mediaRecorder: null,
      mediaSource: null,
      localStream: null,
      localStreamBase: null,
      users: {},
      users_callback: [],
      users_peerConnection: {},
      configuration: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }, // STUN server de Google
        ],
      },
    },
    functions: {},
  };
  const $element = replaceNodeChildren(
    createNodeElement(`
        <div class="div_n2JmnZJ">
        
            <div class="div_JsJRknP">
              <video replace-node-children="video" id="video"></video>
            </div>

            <div class="div_JsJRknP">

                <label id="label-toggle-controls" class="div_JsJRknP element-controls-toggle"><input type="checkbox" style="display:none" checked></label>

                <div class="div_wzhnf2v element-controls-container">
                  <div class="div_qv54F1x" style="padding:10px; justify-content: space-between;">
                    <div class="d-flex-center-y">
                      <div id="div-container-share" class="button_3NrNqDu position-relative-true">
                        <button id="startShare" class="button_lvV6qZu">
                          ${useApp.svgIcon("fi fi-rr-broadcast-tower")}
                        </button>
                        <hr class="hr_v5ql2eJ">
                        <label class="button_lvV6qZu">
                          <input type="checkbox" id="start-stop-sharing">
                        </label>
                      </div>
                      
                    </div>

                    <label class="app-square-var d-flex-center position-relative-true">
                      <input id="input-in-out-chat" type="checkbox" style="display:none" checked>
                      <small class="d-flex">
                        ${useApp.svgIcon("fi fi-rr-messages")}
                      </small>
                    </label>
                  </div>

                  <div class="flex-1 d-flex-center">
                    <button id="button-play-pause" class="button_PsdvFQ app-square-var d-flex-center position-relative-true" style="--square:100px; visibility:hidden;"></button>
                  </div>

                  <div id="div-controls-bottom" class="div_qv54F1x" style="flex-direction: column;">
                  
                    <div class="d-flex d_Ede27MY">
                      <div class="d-flex-center-y position-relative-true">
                        <span id="ele-duration-text" style="padding: 0 20px;">99:99:99</span>
                        <label class="label_PV6iy8u d-flex-center">
                          <input id="recorder-start-stop" type="checkbox" style="display:none">
                          <small id="recorder-start-stop-icon" class="app-square-var d-flex-center">
                            ${useApp.svgIcon("fi fi-rr-dot-circle")}
                          </small>
                          <span id="recorder-start-stop-time">00:00:00</span>
                        </label>
                      </div>
                      <div class="d-flex position-relative-true">
                        <label class="app-square-var d-flex-center">
                          <input id="input-volume" type="checkbox" style="display:none;" checked>
                          <span class="d-flex">${useApp.svgIcon(
                            "fi fi-rr-volume"
                          )}</span>
                        </label>
                        <button id="button-in-out-fullscreen" class="app-square-var d-flex-center">
                          ${useApp.svgIcon("fi fi-rr-expand")}
                        </button>
                      </div>
                    </div>
                    <div id="div-duration-box" class="d-flex-center-y position-relative-true" style="padding:0 10px; height:20px;">
                      <div class="div_fT1UrXe">
                        <input type="range" id="input-duration" min="0" value="0" max="100">
                        <span id="ele-duration-bar"></span>
                      </div>
                    </div>
                  </div>

                </div>
            
            </div>


            <div id="divOptionsShare" class="div_fQ882BV" style="display:none">
              <div class="div_gUJ34Z4">
                <div class="div_rFCtDHa">
                  <input type="text" 
                    value="${useApp.routes.params("id")}" 
                    readonly data-allow-contextmenu>
                  <hr class="hr_v5ql2eJ">
                  <button id="copy-code">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512.629 512.629" style="enable-background:new 0 0 512.629 512.629;" xml:space="preserve" data-svg-name="fi fi-sr-share"><g><path d="M0.006,256.014c-0.218,54.774,44.009,99.354,98.784,99.572c25.226,0.1,49.543-9.416,68-26.612l147.797,66.731   c-1.027,5.526-1.59,11.127-1.685,16.747c-0.174,55.152,44.393,100.002,99.545,100.177s100.002-44.393,100.177-99.545   s-44.393-100.002-99.545-100.177c-32.951-0.104-63.832,16.053-82.534,43.182L191.686,293.39   c9.863-23.816,9.901-50.567,0.107-74.411l138.667-63.019c31.225,45.161,93.148,56.457,138.309,25.232S525.225,88.045,494,42.884   s-93.148-56.457-138.309-25.232c-26.895,18.596-42.926,49.227-42.875,81.925c0.09,5.628,0.661,11.237,1.707,16.768L167.11,183.331   c-39.939-37.503-102.718-35.528-140.221,4.411C9.532,206.228-0.088,230.657,0.006,256.014z"></path></g></svg>
                  </button>
                </div>
                <hr class="hr_vNYePwh">
                <div class="div_6wl7nLt">
                  <button class="button_MTMNjJm"  id="share-with-share-screen">
                    <small>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-screencast"><path d="m24,7v10c0,2.757-2.243,5-5,5h-3c-.552,0-1-.448-1-1s.448-1,1-1h3c1.654,0,3-1.346,3-3V7c0-1.654-1.346-3-3-3H5c-1.363,0-2.557.919-2.902,2.236-.14.534-.684.855-1.221.713-.534-.14-.854-.687-.713-1.221.576-2.195,2.564-3.728,4.836-3.728h14c2.757,0,5,2.243,5,5ZM1.5,19c-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Zm-.5-5c-.552,0-1,.448-1,1s.448,1,1,1c2.757,0,5,2.243,5,5,0,.552.448,1,1,1s1-.448,1-1c0-3.86-3.14-7-7-7Zm.047-5c-.552,0-1,.448-1,1s.448,1,1,1c5.488,0,9.953,4.486,9.953,10,0,.552.448,1,1,1s1-.448,1-1c0-6.617-5.362-12-11.953-12Z"></path></svg>
                    </small>
                    <span>Compartir pantalla</span>
                  </button>
                  <label class="button_MTMNjJm">
                    <input id="share-with-local-video" type="file" accept="video/*" style="display:none">
                    <small>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-folder"><path d="M19,3H12.472a1.019,1.019,0,0,1-.447-.1L8.869,1.316A3.014,3.014,0,0,0,7.528,1H5A5.006,5.006,0,0,0,0,6V18a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V8A5.006,5.006,0,0,0,19,3ZM5,3H7.528a1.019,1.019,0,0,1,.447.1l3.156,1.579A3.014,3.014,0,0,0,12.472,5H19a3,3,0,0,1,2.779,1.882L2,6.994V6A3,3,0,0,1,5,3ZM19,21H5a3,3,0,0,1-3-3V8.994l20-.113V18A3,3,0,0,1,19,21Z"></path></svg>
                    </small>
                    <span>Archivos</span>
                  </label>
                  <button class="button_MTMNjJm" id="share-with-url">
                    <small>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-url"><path d="m15.388,9.221l-.314-3.659c-.026-.302.212-.562.515-.562.27,0,.494.207.516.477l.212,2.681.75-1.443c.193-.372.725-.372.918,0l.75,1.443.21-2.681c.021-.269.246-.477.516-.477h.002c.303,0,.541.26.515.562l-.314,3.659c-.031.44-.337.779-.706.779-.244,0-.471-.151-.601-.4l-.831-1.6-.831,1.6c-.129.249-.356.4-.601.4-.368,0-.675-.339-.706-.779Zm-4.774.779c.244,0,.471-.151.601-.4l.831-1.6.831,1.6c.129.249.356.4.601.4.368,0,.675-.339.706-.779l.314-3.659c.026-.302-.212-.562-.515-.562h-.002c-.27,0-.495.208-.516.477l-.21,2.681-.75-1.443c-.193-.372-.725-.372-.918,0l-.75,1.443-.212-2.681c-.021-.269-.246-.477-.516-.477-.303,0-.541.26-.515.562l.314,3.659c.031.44.337.779.706.779Zm-2.657,0c.368,0,.675-.339.706-.779l.314-3.659c.026-.302-.212-.562-.515-.562h-.002c-.27,0-.495.208-.516.477l-.21,2.681-.75-1.443c-.193-.372-.725-.372-.918,0l-.75,1.443-.212-2.681c-.021-.269-.246-.477-.516-.477-.303,0-.541.26-.515.562l.314,3.659c.031.44.337.779.706.779.244,0,.471-.151.601-.4l.831-1.6.831,1.6c.129.249.356.4.601.4ZM19,0H5C2.243,0,0,2.243,0,5v5c0,2.757,2.243,5,5,5,.553,0,1-.448,1-1s-.447-1-1-1c-1.654,0-3-1.346-3-3v-5c0-1.654,1.346-3,3-3h14c1.654,0,3,1.346,3,3v5c0,1.654-1.346,3-3,3-.553,0-1,.448-1,1s.447,1,1,1c2.757,0,5-2.243,5-5v-5c0-2.757-2.243-5-5-5Zm-.293,22.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.537-2.537c-.791.524-1.738.83-2.756.83-2.757,0-5-2.243-5-5s2.243-5,5-5,5,2.243,5,5c0,1.018-.306,1.965-.83,2.756l2.537,2.537Zm-6.707-2.293c1.654,0,3-1.346,3-3s-1.346-3-3-3-3,1.346-3,3,1.346,3,3,3Z"></path></svg>
                    </small>
                    <span>Enlace</span>
                  </button>
                  <button class="button_MTMNjJm" id="share-with-camera">
                    <small>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-camera"><path d="M19,4h-.508L16.308,1.168A3.023,3.023,0,0,0,13.932,0H10.068A3.023,3.023,0,0,0,7.692,1.168L5.508,4H5A5.006,5.006,0,0,0,0,9V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V9A5.006,5.006,0,0,0,19,4ZM9.276,2.39A1.006,1.006,0,0,1,10.068,2h3.864a1.008,1.008,0,0,1,.792.39L15.966,4H8.034ZM22,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V9A3,3,0,0,1,5,6H19a3,3,0,0,1,3,3Z"></path><path d="M12,8a6,6,0,1,0,6,6A6.006,6.006,0,0,0,12,8Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,12,18Z"></path></svg>
                    </small>
                    <span>Camara</span>
                  </button>
                </div>
              </div>
            </div>
        </div>
    `),
    {
      video: useParams.elements.video,
    }
  );
  const $elements = createObjectElement(
    $element.querySelectorAll("[id]"),
    "id",
    true
  );
  new RenderObjectElement($elements);

  useThis.functions.getPercentage = (current, total) => {
    return (parseInt(current) / parseInt(total)) * 100;
  };

  useThis.functions.convertSecondsToTime = (seconds) => {
    seconds = parseInt(seconds);

    return {
      hours: Math.floor(seconds / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60,
    };
  };

  useThis.functions.newVideo = () => {
    $elements.divOptionsShare.style.display = "none";
    $elements["start-stop-sharing"].checked = true;

    const $video = $elements.video;
    $elements.video = document.createElement("video");

    $video.replaceWith($elements.video);
    $video.src = "";
    $video.srcObject = null;

    $elements.video.addEventListener("loadedmetadata", () => {
      $elements.video.play();
    });

    $elements.video.addEventListener("play", () => {
      $elements["button-play-pause"].innerHTML =
        useApp.svgIcon("fi fi-sr-pause");
    });

    $elements.video.addEventListener("pause", () => {
      $elements["button-play-pause"].innerHTML =
        useApp.svgIcon("fi fi-sr-play");
    });

    $elements.video.addEventListener("durationchange", () => {
      $elements["input-duration"].max = $elements.video.duration;

      $elements["button-play-pause"].style.visibility =
        $elements.video.duration == Infinity ? "hidden" : "";

      $elements["div-duration-box"].style.visibility =
        $elements.video.duration == Infinity ? "hidden" : "";

      $elements["div-controls-bottom"].style.padding =
        $elements.video.duration == Infinity ? "10px" : "";
    });

    $elements.video.addEventListener("timeupdate", () => {
      if (!$elements["input-duration"].getAttribute("data-input")) {
        const convert = useThis.functions.convertSecondsToTime(
          $elements.video.currentTime
        );

        $elements["ele-duration-text"].textContent = [
          convert.hours,
          convert.minutes,
          convert.seconds,
        ]
          .map((num) => {
            return String(num).padStart(2, "0");
          })
          .join(":");

        $elements[
          "ele-duration-bar"
        ].style.width = `${useThis.functions.getPercentage(
          $elements.video.currentTime,
          $elements.video.duration
        )}%`;
      }
    });

    return $elements.video;
  };

  useThis.functions.streamStop = () => {
    const stream = useThis.values.localStream;
    useThis.values.localStream = null;
    useApp.values.streamDinamic = null;

    if (stream) {
      stream?.getTracks?.().forEach((track) => track.stop());
      stream?.close?.();
    }
  };

  useThis.functions.streamStart = (stream = null) => {
    useThis.functions.streamStop();
    useThis.values.localStream = stream;
    useApp.values.streamDinamic = stream;

    $elements["button-play-pause"].style.visibility = stream ? "" : "hidden";

    if (stream) {
      const tracks = stream.getTracks().reduce((acc, curr) => {
        acc[curr.kind] = curr;
        return acc;
      }, {});

      Object.values(useApp.values.peerConnections).forEach((peerConnection) => {
        peerConnection.getSenders().forEach((sender) => {
          if (tracks[sender.track.kind]) {
            sender.replaceTrack(tracks[sender.track.kind]);
          }
        });
      });
    }

    return stream;
  };

  $elements["input-in-out-chat"]?.addEventListener("change", (e) => {
    useParams.oValues.showComponentMessage.value = e.target.checked;
  });

  $elements["button-in-out-fullscreen"].addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else useThis.elements.fullscreen?.requestFullscreen();
  });

  $elements["label-toggle-controls"]?.addEventListener("click", (e) => {
    if (e.target == e.currentTarget) {
      const time = Date.now();
      useThis.values.dblclick.diff = time - useThis.values.dblclick.time;
      useThis.values.dblclick.time = time;
    }
  });

  $elements["label-toggle-controls"]?.addEventListener("dblclick", () => {
    if (useThis.values.dblclick.diff < 250) {
      if (document.fullscreenElement) document.exitFullscreen();
      else useThis.elements.fullscreen?.requestFullscreen();
    }
  });

  $elements["input-duration"]?.addEventListener("input", () => {
    $elements["input-duration"].setAttribute("data-input", "1");
    $elements[
      "ele-duration-bar"
    ].style.width = `${useThis.functions.getPercentage(
      $elements["input-duration"].value,
      $elements["input-duration"].max
    )}%`;
  });

  $elements["input-duration"]?.addEventListener("change", () => {
    $elements["input-duration"].removeAttribute("data-input");
    $elements.video.currentTime = +$elements["input-duration"].value;
  });

  $elements["button-play-pause"]?.addEventListener("click", () => {
    if ($elements.video.readyState >= 3) {
      if ($elements.video.paused) $elements.video.play();
      else $elements.video.pause();
    }
  });

  $elements.startShare.addEventListener("click", () => {
    $elements.divOptionsShare.style.display = "";
  });

  $elements.divOptionsShare.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      e.target.style.display = "none";
    }
  });

  $elements["share-with-share-screen"].addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      useThis.functions.streamStart(stream);
      useThis.functions.newVideo();

      $elements.video.srcObject = stream;
    } catch (error) {
      alert(error.message);
    }
  });

  $elements["share-with-camera"]?.addEventListener("click", () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Solicitamos acceso a la cámara y el micrófono
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: true })
        .then((stream) => {
          useThis.functions.streamStart(stream);
          useThis.functions.newVideo();

          $elements.video.srcObject = stream;
          $elements.video.style.transform = "scaleX(-1)";
        })
        .catch((error) => {
          console.error("Error al acceder a la cámara o micrófono:", error);
        });
    } else {
      alert("Tu navegador no soporta la API getUserMedia");
    }
  });

  $elements["share-with-local-video"]?.addEventListener("change", (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      e.target.value = "";
      if (file.type.includes("video")) {
        useThis.functions.newVideo();

        $elements.video.addEventListener("loadedmetadata", () => {
          const stream = $elements.video.captureStream();
          useThis.functions.streamStart(stream);

          // const mediaRecorder = new MediaRecorder(stream);
        });

        $elements.video.src = URL.createObjectURL(file);
      }
    }
  });

  $elements["share-with-url"].addEventListener("click", () => {
    const url = prompt("ingrese una url");

    try {
      const nURL = new URL(url);

      useThis.functions.newVideo();

      $elements.video.addEventListener("loadedmetadata", () => {
        const stream = $elements.video.captureStream();
        useThis.functions.streamStart(stream);
      });

      // const $video = document.createElement("video");
      // $element.querySelector("video").replaceWith($video);
      // $video.setAttribute("controls", "");

      // $video.addEventListener("loadedmetadata", () => {
      //   const stream = $video.captureStream();

      //   useThis.functions.stopLocalStream();
      //   useThis.values.localStream = stream;
      //   useThis.functions.startLocalStream();

      //   $video.play();
      // });

      $elements.video.addEventListener("error", (e) => {
        if (e.target.error.code == 4) {
          alert("El video no puede ser reproducido");
        }
      });

      if (nURL.href.includes(".m3u8")) {
        const callbackVideo = ($video, $videoSrc) => {
          if (Hls.isSupported()) {
            const video = $video;
            const hls = new Hls();

            // Cargar el archivo HLS
            hls.loadSource($videoSrc); // Reemplaza con la URL de tu archivo HLS

            // Asociar el HLS al reproductor de video
            hls.attachMedia(video);

            // Manejar eventos
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              console.log(
                "Manifest parsed, found " +
                  data.levels.length +
                  " quality level(s)"
              );
            });

            // Manejar el caso cuando no se puede usar hls.js (por ejemplo, si el navegador soporta HLS nativamente)
          } else if ($video.canPlayType("application/vnd.apple.mpegurl")) {
            // Para Safari que soporta HLS de manera nativa
            $video.src = $videoSrc; // Reemplaza con la URL de tu archivo HLS
          } else {
            console.error("HLS no es soportado por este navegador");
          }
        };
        callbackVideo($elements.video, nURL.href);
      } else {
        $elements.video.src = nURL.href;
      }
    } catch (error) {
      alert("La url no es valida");
    }
  });

  $elements["start-stop-sharing"].addEventListener("change", (e) => {
    if (e.target.checked) {
      $elements.divOptionsShare.style.display = "";
    } else {
      $elements.video.src = "";
      $elements.video.srcObject = null;
      useThis.functions.streamStart(null);
    }
    e.target.checked = false;
  });

  $elements["input-volume"]?.addEventListener("change", (e) => {
    // console.log(e.target.nextElementSibling);
    e.target.nextElementSibling.innerHTML = useApp.svgIcon(
      e.target.checked ? "fi fi-rr-volume" : "fi fi-rr-volume-mute"
    );

    $elements.video.muted = !e.target.checked;
  });

  $elements["recorder-start-stop"]?.addEventListener("change", (e) => {
    if (e.target.checked) {
      if (useApp.values.streamDinamic) {
        const stream = useApp.values.streamDinamic;
        const options = {
          mimeType: "video/webm; codecs=vp9,opus",
          // ideoBitsPerSecond: 5000000, // 5 Mbps para video
          // audioBitsPerSecond: 128000, // 128 kbps para audio
        };

        const mediaRecorder = new MediaRecorder(stream, options);
        useThis.values.mediaRecorder = mediaRecorder;

        const chunks = []; // Para almacenar los datos grabados

        let seconds = 0;

        $elements["recorder-start-stop-time"].textContent = "00:00:00";

        mediaRecorder.ondataavailable = (event) => {
          const convert = useThis.functions.convertSecondsToTime(++seconds);

          $elements["recorder-start-stop-time"].textContent = [
            convert.hours,
            convert.minutes,
            convert.seconds,
          ]
            .map((num) => {
              return String(num).padStart(2, "0");
            })
            .join(":");

          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          // Crear un enlace de descarga
          const a = document.createElement("a");
          a.href = url;
          a.download = `recording-${Date.now()}.webm`;
          a.click();
          // Liberar recursos
          URL.revokeObjectURL(url);
        };

        // Iniciar la grabación
        mediaRecorder.start(1000);
      } else {
        e.target.checked = false;
        return;
      }
    } else {
      const mediaRecorder = useThis.values.mediaRecorder;
      mediaRecorder?.stop();
      console.log("Grabación detenida.");
    }

    $elements["recorder-start-stop-icon"].innerHTML = useApp.svgIcon(
      e.target.checked ? "fi fi-rr-stop" : "fi fi-rr-dot-circle"
    );
  });

  setTimeout(() => {
    useThis.elements.fullscreen = $element.closest("[data-element-fullscreen]");
    useThis.elements.fullscreen?.addEventListener("fullscreenchange", () => {
      $elements["button-in-out-fullscreen"].innerHTML = useApp.svgIcon(
        document.fullscreenElement ? "fi fi-rr-compress" : "fi fi-rr-expand"
      );

      if (document.fullscreenElement) {
        window.screen.orientation.lock("landscape");
      } else {
        window.screen.orientation.unlock();
      }
    });
  });

  if (useParams.from == "r") {
    $elements["div-controls-bottom"].style.padding = "10px";
    Array.from(["div-container-share", "div-duration-box"]).forEach((child) => {
      $elements[child].remove();
    });

    $elements.video.addEventListener("loadedmetadata", () => {
      $elements.video.play();
      $elements["button-play-pause"].style.visibility = "";
    });

    $elements.video.addEventListener("timeupdate", () => {
      const convert = useThis.functions.convertSecondsToTime(
        $elements.video.currentTime
      );

      $elements["ele-duration-text"].textContent = [
        convert.hours,
        convert.minutes,
        convert.seconds,
      ]
        .map((num) => {
          return String(num).padStart(2, "0");
        })
        .join(":");
    });

    $elements.video.addEventListener("play", () => {
      $elements["button-play-pause"].innerHTML =
        useApp.svgIcon("fi fi-sr-pause");
    });

    $elements.video.addEventListener("pause", () => {
      $elements["button-play-pause"].innerHTML =
        useApp.svgIcon("fi fi-sr-play");
    });
  }

  return $element;
};

var messageChat = () => {
  const useApp = window.dataApp;
  const useThis = {
    functions: {},
    events: {},
  };

  const $element = createNodeElement(`
    <div class="div_1YChHXL">

      <div class="div_u6cyIBh app-scroll-y">

        <div id="itemTrueMessage" class="div_YdRU5oK"></div>

      </div>
      <form id="form" class="form_4kMoTX0" autocomplete="off">
        <input type="text" name="message" placeholder="escribir..." autocomplete="off">
        <button type="submit">
          ${useApp.svgIcon("fi fi-rr-arrow-small-up")}
        </button>
      </form>
    
    </div>
    `);
  const $elements = createObjectElement(
    $element.querySelectorAll("[id]"),
    "id",
    true
  );
  new RenderObjectElement($elements);

  useThis.events.emitSocket = (e) => {
    const data = e?.detail;
    const idApp = data?.head?.idApp;
    const id = data?.head?.id;
    const from = data?.head?.from;

    if (idApp == useApp.uid) {
      if (id == useApp.routes.params("id")) {
        if (from == "chat-message") {
          useThis.functions.newMessage(data?.body?.data);
        }
      }
    }
  };

  useThis.functions.newMessage = (data) => {
    const message = EncodeTemplateString.toTextarea(data.message);
    const $element = createNodeElement(`
      <div class="div_swfXLvE">
        <img src="${data.avatar}">
        <div class="div_pyfMVjZ">
          <span>${data.name}</span>
          <p>${message}</p>
        </div>
      </div>
      `);

    $elements.itemTrueMessage.append($element);

    $element.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: "smooth",
    });
  };

  $elements.form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      message: $elements.form.message.value.trim(),
      avatar: useApp.user.data.avatar,
      name: useApp.user.data.first_name,
    };

    $elements.form.message.value = "";
    $elements.form.message.focus();

    useThis.functions.newMessage(data);

    useApp.socket.io.emit("emit-data", {
      head: {
        idApp: useApp.uid,
        from: "chat-message",
        id: useApp.routes.params("id"),
        uuid: useApp.user.data.uid,
      },
      body: {
        data,
      },
    });
  });

  addEventListener("emit-data", useThis.events.emitSocket);
  addEventListener(
    "hashchange",
    () => {
      removeEventListener("emit-data", useThis.events.emitSocket);
    },
    { once: true }
  );

  return $element;
};

var eId = () => {
  const useApp = window.dataApp;
  const useThis = {
    oValues: {
      users: observeValue([useApp.user.data]),
      showComponentMessage: observeValue(true),
    },
    values: {
      controller: new AbortController(),
      localStream: null,
      localStreamBase: null,
      users: {},
      users_callback: [],
      users_peerConnection: [],
      configuration: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }, // STUN server de Google
        ],
      },
    },
    functions: {},
    elements: {
      video: document.createElement("video"),
    },
  };

  console.log(useApp.user.data.uid);

  // if (!localStorage.getItem("user-UUID")) {
  //   localStorage.setItem("user-UUID", crypto.randomUUID());
  // }

  const UUID = useApp.user.data.uid;
  const ID_APP =
    "id-app-cf63f8b2c10e10008e773a856dd6a450db17857965db51fbc3006d8d810d939b";

  const $element = replaceNodeChildren(
    createNodeElement(`
          <div class="div_Xu02Xjh">
              <header class="header_K0hs3I0">
  
                  <div class="div_uNg74XS">
                      <a href="#/" class="button_lvV6qZu">
                        ${useApp.svgIcon("fi fi-rr-angle-small-left")}
                      </a>
                      <h3 id="textTitle">
                        ${useApp.routes.params("id")}
                      </h3>
                  </div>

                  <div class="div_x0cH0Hq">
                    
                    <div class="button_3NrNqDu">
                      <button id="button-users" class="button_lvV6qZu">
                      ${useApp.svgIcon("fi fi-rr-users-alt")}
                      </button>
                      <hr class="hr_v5ql2eJ">
                      <span id="span-user-length" class="button_lvV6qZu" style="padding-right:10px">20</span>
                    </div>
                  </div>

              </header>
  
              <div id="div-screen-chat" class="div_guZ6yID div_6wLk6EG" style="user-select:none" data-element-fullscreen>

                    <div class="div_RQgQr6z">
                      <div replace-node-children="componentVideo" id="componentVideo" style="display:none"></div>
                    </div>

                    <div id="div-chat" class="div_lIlvX4G">
                      <div replace-node-children="messageChat"></div>
                    </div>

              </div>

              <div id="div-popup-users" class="div_iHpeaEf" style="display:none;">
              
                  <div class="div_YWVQ42c">
                  
                      <div class="d-flex-center-y" style="padding:10px; gap:10px">
                      
                        <button class="app-square-var d-flex-center">
                          ${useApp.svgIcon("fi fi-rr-angle-left")}
                        </button>

                        <span>Usuarios</span>

                      </div>
                      <div id="div-user-true" class="flex-1 app-scroll-y"></div>

                  </div>

              </div>
          </div>
    `),
    {
      componentVideo: componentVideo({
        oValues: useThis.oValues,
        elements: useThis.elements,
        from: "e",
      }),
      messageChat: messageChat(),
    }
  );

  const $elements = createObjectElement(
    $element.querySelectorAll("[id]"),
    "id",
    true
  );
  new RenderObjectElement($elements);

  useThis.oValues.showComponentMessage.observe((value) => {
    $elements["div-chat"].style.display = value ? "" : "none";
  });

  useThis.oValues.users.observe((value) => {
    console.log(value);
    $elements["span-user-length"].innerHTML = value.length;
    $elements["div-user-true"].innerHTML = value
      .map((data, index) => {
        if (!data) return "";
        return `
        <div class="d-flex-center-y" style="padding:10px; gap:10px" data-item="${
          data.uid
        }">
                        
          <img src="${data.avatar}" class="app-square-var d-flex-center">
          <p class="flex-1">${data.first_name}</p>
          ${
            index == 0
              ? `
              <button class="app-square-var d-flex-center" data-index="${index}">
                ${useApp.svgIcon(
                  index == 0 ? "fi fi-rr-pencil" : "fi fi-rr-ban"
                )}
              </button>
            `
              : ""
          }
          

        </div>
      `;
      })
      .join("");
  });

  $elements["div-user-true"].addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (button) {
      button.closest("[data-item]");
      const index = parseInt(button.getAttribute("data-index"));
      console.log(index);
      if (index === 0) {
        const name = prompt("Cambiar nombre", useApp.user.data.first_name);
        if (name.trim() != "") {
          useApp.user.data.first_name = name;
          localStorage.setItem("user-auth", JSON.stringify(useApp.user.data));
          useThis.oValues.users.value = [...useThis.oValues.users.value];
        }
      }
    }
  });

  $elements["button-users"].addEventListener("click", () => {
    $elements["div-popup-users"].style.display = "";
  });

  $elements["div-popup-users"].addEventListener("click", (e) => {
    if (e.target == e.currentTarget) {
      e.target.style.display = "none";
    }
  });

  addEventListener(
    "emit-data",
    (e) => {
      const data = e?.detail;
      const idApp = data?.head?.idApp;
      const id = data?.head?.id;
      const from = data?.head?.from;

      if (idApp == ID_APP) {
        if (id == useApp.routes.params("id")) {
          if (from == "answer") {
            const peerConnection =
              useApp.values.peerConnections?.[data?.head.uuid];
            peerConnection.setRemoteDescription(
              new RTCSessionDescription(data?.body?.answer)
            );
          }

          if (from == "candidate") {
            const peerConnection =
              useApp.values.peerConnections?.[data?.head.uuid];
            peerConnection.addIceCandidate(
              new RTCIceCandidate(data?.body?.candidate)
            );
          }

          if (from == "join") {
            const callbackPerConnection = async () => {
              console.log(data);
              useThis.oValues.users.value = useThis.oValues.users.value.concat(
                data.body.data
              );

              const configuration = useThis.values.configuration;
              useApp.values.peerConnections[data.head.uuid] =
                new RTCPeerConnection(configuration);
              const peerConnection =
                useApp.values.peerConnections[data.head.uuid];

              const localStream = useApp.values.stream;
              // // Añadir el stream local al PeerConnection
              localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
              });

              if (useApp.values.streamDinamic) {
                const tracks = useApp.values.streamDinamic
                  .getTracks()
                  .reduce((acc, curr) => {
                    acc[curr.kind] = curr;
                    return acc;
                  }, {});

                peerConnection.getSenders().forEach((sender) => {
                  if (tracks[sender.track.kind]) {
                    sender.replaceTrack(tracks[sender.track.kind]);
                  }
                });
              }

              // Crear una oferta (SDP)
              const offer = await peerConnection.createOffer();
              await peerConnection.setLocalDescription(offer);
              // Enviar la oferta al receptor a través de Socket.IO
              useApp.socket.io.emit("emit-data", {
                head: {
                  idApp: ID_APP,
                  from: "offer",
                  id: useApp.routes.params("id"),
                  uuid: UUID,
                },
                body: {
                  uuid: data?.head?.uuid,
                  offer,
                },
              });
              // Manejar la recepción de candidatos ICE
              peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                  useApp.socket.io.emit("emit-data", {
                    head: {
                      idApp: ID_APP,
                      from: "candidate",
                      id: useApp.routes.params("id"),
                      uuid: UUID,
                    },
                    body: {
                      uuid: data?.head?.uuid,
                      candidate: event.candidate,
                    },
                  });
                }
              };
            };

            data?.head?.uuid;

            // useThis.values._users_callback = useThis.values._users_callback
            //   .filter((object) => object.uuid != uuid)
            //   .concat({
            //     uuid: uuid,
            //     peerConnection: callbackPerConnection,
            //     status: Boolean(useThis.values.localStream),
            //   });

            callbackPerConnection();
            // useThis.functions.startLocalStream();
          }
        }
      }
    },
    {
      signal: useThis.values.controller.signal,
    }
  );

  addEventListener(
    "hashchange",
    () => {
      // removeEventListener("emit-data", callbackEmitSocket);
      useThis.values.controller.abort();
    },
    { once: true }
  );

  callbackTryCatch(() => {
    if (useApp.values.stream) {
      $elements.componentVideo.style.display = "";
    } else {
      const video = document.createElement("video");
      video.src =
        "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAABQbWRhdAAAAAAAAAAAIRAEYIwcAAAANmWIgABAAAF//uVF5lkdZ8ITYAEQ743d/Ty5lMW6vJNTKrNGsd2heyiAKWRQAwD5I3yBWtAXdwAABDJtb292AAAAbG12aGQAAAAA45twJOObcCQAAAOEAAAAAAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAABt3RyYWsAAABcdGtoZAAAAAfjm3Ak45twJAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAVNtZGlhAAAAIG1kaGQAAAAA45twJOObcCQAAKxE/////xXHAAAAAAAsaGRscgAAAAAAAAAAc291bgAAAAAAAAAAAAAAAFNvdW5kSGFuZGxlAAAAAP9taW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAMNzdGJsAAAAW3N0c2QAAAAAAAAAAQAAAEttcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAACdlc2RzAAAAAAMZAAAABBFAFQAGAAAB9AAAAKxEBQISEAYBAgAAABhzdHRzAAAAAAAAAAEAAAAB/////wAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAYc3RzegAAAAAAAAAAAAAAAQAAAAYAAAAUc3RjbwAAAAAAAAABAAAAMAAAAgd0cmFrAAAAXHRraGQAAAAH45twJOObcCQAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAKAAAACgAAAAAAGjbWRpYQAAACBtZGhkAAAAAOObcCTjm3AkAAFfkP////8VxwAAAAAALGhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZQAAAAFPbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAABD3N0YmwAAACTc3RzZAAAAAAAAAABAAAAg2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAoACgAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAtYXZjQwFkADP/4QASZ2QACqwbGoKFaagwCCg8IhGoAQAEaOpDy3v39wAAAAAYc3R0cwAAAAAAAAABAAAAAf////8AAAAUc3RzcwAAAAAAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAYc3RzegAAAAAAAAAAAAAAAQAAADoAAAAUc3RjbwAAAAAAAAABAAAANg==";

      video.addEventListener("loadedmetadata", () => {
        $elements.componentVideo.style.display = "";
        useApp.values.stream = video.captureStream();
      });
    }
  });

  useApp.socket.io?.emit("emit-data", {
    head: {
      idApp: useApp.uid,
      from: "invite",
      id: useApp.routes.params("id"),
      uuid: useApp.user.data.uid,
    },
    body: {},
  });

  return $element;
};

var rId = () => {
  const useApp = window.dataApp;
  const useThis = {
    oValues: {
      showComponentMessage: observeValue(true),
    },
    values: {
      controller: new AbortController(),
    },
    elements: {
      video: document.createElement("video"),
    },
  };

  const $element = replaceNodeChildren(
    createNodeElement(`
          <div class="div_Xu02Xjh">
              <header class="header_K0hs3I0">
  
                  <div class="div_uNg74XS">
                      <a href="#/" class="button_lvV6qZu">
                        ${useApp.svgIcon("fi fi-rr-angle-small-left")}
                      </a>
                      <h3 id="textTitle">Volver</h3>
                  </div>
              </header>
  
              <div id="div-screen-chat" class="div_guZ6yID" style="user-select:none" data-element-fullscreen>
                 
                  <div class="div_RQgQr6z">
                    <div replace-node-children="componentVideo" id="componentVideo"></div>
                  </div>

                  <div id="div-chat" class="div_lIlvX4G">
                    <div replace-node-children="messageChat"></div>
                  </div>

              </div>
          </div>
      `),
    {
      componentVideo: componentVideo({
        oValues: useThis.oValues,
        elements: useThis.elements,
        from: "r",
      }),
      messageChat: messageChat(),
    }
  );
  const $elements = createObjectElement(
    $element.querySelectorAll("[id]"),
    "id",
    true
  );
  new RenderObjectElement($elements);

  useThis.oValues.showComponentMessage.observe((value) => {
    $elements["div-chat"].style.display = value ? "" : "none";
  });

  // $element.querySelector("video").addEventListener("loadedmetadata", (e) => {
  //   console.log("godd");
  //   e.target.play();
  // });

  addEventListener(
    "emit-data",
    (e) => {
      const data = e?.detail;
      const idApp = data?.head?.idApp;
      const id = data?.head?.id;
      const from = data?.head?.from;

      if (idApp == useApp.uid) {
        if (id == useApp.routes.params("id")) {
          if (data?.body?.uuid == useApp.user.data.uid) {
            if (from == "offer") {
              const callback = async (offer) => {
                // Crear una nueva RTCPeerConnection
                const configuration = useThis.values.configuration;
                const peerConnection = new RTCPeerConnection(configuration);
                useThis.values.peerConnection = peerConnection;
                // Manejar los candidatos ICE
                peerConnection.onicecandidate = (event) => {
                  if (event.candidate) {
                    useApp.socket.io?.emit("emit-data", {
                      head: {
                        idApp: useApp.uid,
                        from: "candidate",
                        id: useApp.routes.params("id"),
                        uuid: useApp.user.data.uid,
                      },
                      body: {
                        candidate: event.candidate,
                      },
                    });
                  }
                };
                // Cuando se recibe el stream del emisor
                peerConnection.ontrack = (event) => {
                  console.log(event);
                  useThis.elements.video.srcObject = event.streams[0];
                };
                // Establecer la oferta como la descripción remota
                await peerConnection.setRemoteDescription(
                  new RTCSessionDescription(offer)
                );
                // Crear una respuesta (SDP)
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                // Enviar la respuesta al emisor
                useApp.socket.io?.emit("emit-data", {
                  head: {
                    idApp: useApp.uid,
                    from: "answer",
                    id: useApp.routes.params("id"),
                    uuid: useApp.user.data.uid,
                  },
                  body: {
                    answer,
                  },
                });
              };
              callback(data?.body?.offer);
            }
            if (from == "candidate") {
              const peerConnection = useThis.values.peerConnection;
              peerConnection.addIceCandidate(
                new RTCIceCandidate(data?.body?.candidate)
              );
            }
          }

          if (from == "invite") {
            useApp.socket.io?.emit("emit-data", {
              head: {
                idApp: useApp.uid,
                from: "join",
                id: useApp.routes.params("id"),
                uuid: useApp.user.data.uid,
              },
              body: {},
            });
          }
        }
      }
    },
    {
      signal: useThis.values.controller.signal,
    }
  );

  addEventListener(
    "hashchange",
    () => {
      useThis.values.controller.abort();
    },
    { once: true }
  );

  useApp.socket.io?.emit("emit-data", {
    head: {
      idApp: useApp.uid,
      from: "join",
      id: useApp.routes.params("id"),
      uuid: useApp.user.data.uid,
    },
    body: {
      data: useApp.user.data,
    },
  });

  return $element;
};

var error404 = () => {
  const useApp = window.dataApp;

  const $element = createNodeElement(`
        <div class="div_Xu02Xjh">
            <header class="header_K0hs3I0">

                <div class="div_uNg74XS">
                    <a href="#/" class="button_lvV6qZu">
                      ${useApp.svgIcon("fi fi-rr-angle-small-left")}
                    </a>
                    <h3 id="textTitle">Volver</h3>
                </div>
            </header>

            <div id="item" class="div_guZ6yID" style="padding:10px;">
                <img src="https://cdn-icons-png.flaticon.com/512/9821/9821299.png" class="app-square-var m-auto" style="--square: min(100%, 400px); filter: grayscale(100%);">
                <input type="file" id="folderInput" webkitdirectory>
            </div>
        </div>
    `);
  const $elements = createObjectElement(
    $element.querySelectorAll("[id]"),
    "id",
    true
  );
  new RenderObjectElement($elements);

  $elements.folderInput.addEventListener("change", (e) => {
    const files = e.target.files;

    for (const file of files) {
      console.log(file);

      $elements.item.innerHTML += `Archivo: ${file.name}, Ruta: ${file.webkitRelativePath}<br>`;
      // console.log(`Archivo: ${file.name}, Ruta: ${file.webkitRelativePath}`);
    }
  });

  return $element;
};

var routes = () => {
  const useApp = window.dataApp;

  const $element = createNodeElement(`<div class="routes"></div>`);

  useApp.routes.set([
    { hash: "/", callback: () => routesUser(inicio) },
    { hash: "/e/:id", callback: () => routesUser(eId) },
    { hash: "/r/:id", callback: () => routesUser(rId) },
    { hash: "/*", callback: error404 },
  ]);

  addEventListener("hashchange", (e) => {
    // useApp.elements.meta.color.setAttribute("content", "#000000");

    $element.innerHTML = "";
    $element.append(useApp.routes.get() ?? "");

    if (document.fullscreenElement) document.exitFullscreen();
  });

  return $element;
};

var eleAlert = () => {
  const $element = createNodeElement(`
        <div class="div_4To3WRE"></div>
    `);

  const Color = [
    { color: "#82C9AC", name: "success" },
    { color: "#E79B9B", name: "danger" },
    { color: "#AEC8E8", name: "info" },
    { color: "#F7D08A", name: "warning" },
    { color: "#343A40", name: "dark" },
  ];

  addEventListener("_notification", (e) => {
    const detail = e.detail;
    console.log(detail);
    const color =
      (Color.find((color) => color.name == detail.name) ?? {}).color ??
      "#343A40";
    const duration = detail.duration ?? 2000;
    const remove = detail.remove ?? true;

    $element.insertAdjacentHTML(
      "afterbegin",
      `
            <div class="div_d3zFZTz" style="background: ${color}; --time-bar:${
        duration / 1000
      }s" data-item>
                <div class="div_mUJ1ZKX8wrXPI7B">
                    <span>${detail.message}</span>
                    <button>
                    <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M18,6h0a1,1,0,0,0-1.414,0L12,10.586,7.414,6A1,1,0,0,0,6,6H6A1,1,0,0,0,6,7.414L10.586,12,6,16.586A1,1,0,0,0,6,18H6a1,1,0,0,0,1.414,0L12,13.414,16.586,18A1,1,0,0,0,18,18h0a1,1,0,0,0,0-1.414L13.414,12,18,7.414A1,1,0,0,0,18,6Z"></path></svg>
                    </button>
                </div>
                ${remove ? "<hr>" : ""}
            </div>
        `
    );

    const element = $element.children[0];
    if (remove) setTimeout(() => element.remove(), duration);
  });

  $element.addEventListener("click", (e) => {
    if (e.target.closest("button")) e.target.closest("[ data-item ]").remove();
  });

  return $element;
};

var svgIcon = () => {
  const template = document.createElement("div");

  template.innerHTML = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-stop"><path d="M19,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V5A5.006,5.006,0,0,0,19,0Zm3,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H19a3,3,0,0,1,3,3Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-dot-circle"><path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,22c-5.514,0-10-4.486-10-10S6.486,2,12,2s10,4.486,10,10-4.486,10-10,10Zm4-10c0,2.209-1.791,4-4,4s-4-1.791-4-4,1.791-4,4-4,4,1.791,4,4Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-volume-mute"><path d="m13.644.418c-.228-.19-.529-.268-.821-.215-3.001.555-5.754,2.302-7.554,4.794h-.271C2.241,4.998-.002,7.241-.002,9.998v4.005C-.002,16.76,2.241,19.003,4.998,19.003h.271c1.802,2.495,4.555,4.243,7.554,4.794.06.011.121.017.181.017.232,0,.459-.081.64-.231.228-.19.36-.472.36-.769V1.187c0-.297-.131-.579-.36-.769Zm-1.64,21.117c-2.03-.646-3.851-1.954-5.113-3.703l-.299-.415c-.188-.26-.489-.415-.811-.415h-.782c-1.654,0-3-1.346-3-3v-4.005c0-1.654,1.346-3,3-3h.782c.321,0,.623-.154.811-.415l.299-.415c1.261-1.747,3.083-3.054,5.114-3.702v19.068Zm11.729-7.242c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414l-2.293,2.293,2.293,2.293Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-sr-pause"><path d="M6.5,0A3.5,3.5,0,0,0,3,3.5v17a3.5,3.5,0,0,0,7,0V3.5A3.5,3.5,0,0,0,6.5,0Z"></path><path d="M17.5,0A3.5,3.5,0,0,0,14,3.5v17a3.5,3.5,0,0,0,7,0V3.5A3.5,3.5,0,0,0,17.5,0Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-messages"><path d="m19,4h-1.101c-.465-2.279-2.485-4-4.899-4H5C2.243,0,0,2.243,0,5v12.854c0,.794.435,1.52,1.134,1.894.318.171.667.255,1.015.255.416,0,.831-.121,1.19-.36l2.95-1.967c.691,1.935,2.541,3.324,4.711,3.324h5.697l3.964,2.643c.36.24.774.361,1.19.361.348,0,.696-.085,1.015-.256.7-.374,1.134-1.1,1.134-1.894v-12.854c0-2.757-2.243-5-5-5ZM2.23,17.979c-.019.012-.075.048-.152.007-.079-.042-.079-.109-.079-.131V5c0-1.654,1.346-3,3-3h8c1.654,0,3,1.346,3,3v7c0,1.654-1.346,3-3,3h-6c-.327,0-.541.159-.565.175l-4.205,2.804Zm19.77,3.876c0,.021,0,.089-.079.131-.079.041-.133.005-.151-.007l-4.215-2.811c-.164-.109-.357-.168-.555-.168h-6c-1.304,0-2.415-.836-2.828-2h4.828c2.757,0,5-2.243,5-5v-6h1c1.654,0,3,1.346,3,3v12.854Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-volume"><path d="M20.807,4.29a1,1,0,0,0-1.415,1.415,8.913,8.913,0,0,1,0,12.59,1,1,0,0,0,1.415,1.415A10.916,10.916,0,0,0,20.807,4.29Z"></path><path d="M18.1,7.291A1,1,0,0,0,16.68,8.706a4.662,4.662,0,0,1,0,6.588A1,1,0,0,0,18.1,16.709,6.666,6.666,0,0,0,18.1,7.291Z"></path><path d="M13.82.2A12.054,12.054,0,0,0,6.266,5H5a5.008,5.008,0,0,0-5,5v4a5.008,5.008,0,0,0,5,5H6.266A12.059,12.059,0,0,0,13.82,23.8a.917.917,0,0,0,.181.017,1,1,0,0,0,1-1V1.186A1,1,0,0,0,13.82.2ZM13,21.535a10.083,10.083,0,0,1-5.371-4.08A1,1,0,0,0,6.792,17H5a3,3,0,0,1-3-3V10A3,3,0,0,1,5,7h1.8a1,1,0,0,0,.837-.453A10.079,10.079,0,0,1,13,2.465Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-arrow-small-up"><path d="M17.71,9.88l-4.3-4.29a2,2,0,0,0-2.82,0L6.29,9.88a1,1,0,0,0,0,1.41,1,1,0,0,0,1.42,0L11,8V19a1,1,0,0,0,2,0V8l3.29,3.29a1,1,0,1,0,1.42-1.41Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-arrow-up"><path d="M6,6.21a1,1,0,0,0,1.41,0L11,2.58V23a1,1,0,0,0,1,1h0a1,1,0,0,0,1-1V2.59l3.62,3.62a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.41L14.13.88a3,3,0,0,0-4.24,0L6,4.8A1,1,0,0,0,6,6.21Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-compress"><path d="M7,0A1,1,0,0,0,6,1V3A3,3,0,0,1,3,6H1A1,1,0,0,0,1,8H3A5.006,5.006,0,0,0,8,3V1A1,1,0,0,0,7,0Z"></path><path d="M23,16H21a5.006,5.006,0,0,0-5,5v2a1,1,0,0,0,2,0V21a3,3,0,0,1,3-3h2a1,1,0,0,0,0-2Z"></path><path d="M21,8h2a1,1,0,0,0,0-2H21a3,3,0,0,1-3-3V1a1,1,0,0,0-2,0V3A5.006,5.006,0,0,0,21,8Z"></path><path d="M3,16H1a1,1,0,0,0,0,2H3a3,3,0,0,1,3,3v2a1,1,0,0,0,2,0V21A5.006,5.006,0,0,0,3,16Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-play"><path d="M20.494,7.968l-9.54-7A5,5,0,0,0,3,5V19a5,5,0,0,0,7.957,4.031l9.54-7a5,5,0,0,0,0-8.064Zm-1.184,6.45-9.54,7A3,3,0,0,1,5,19V5A2.948,2.948,0,0,1,6.641,2.328,3.018,3.018,0,0,1,8.006,2a2.97,2.97,0,0,1,1.764.589l9.54,7a3,3,0,0,1,0,4.836Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-pause"><path d="M6.5,0A3.5,3.5,0,0,0,3,3.5v17a3.5,3.5,0,0,0,7,0V3.5A3.5,3.5,0,0,0,6.5,0ZM8,20.5a1.5,1.5,0,0,1-3,0V3.5a1.5,1.5,0,0,1,3,0Z"></path><path d="M17.5,0A3.5,3.5,0,0,0,14,3.5v17a3.5,3.5,0,0,0,7,0V3.5A3.5,3.5,0,0,0,17.5,0ZM19,20.5a1.5,1.5,0,0,1-3,0V3.5a1.5,1.5,0,0,1,3,0Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-sr-volume"><path d="M20.8,4.293A1,1,0,0,0,19.39,5.707a8.911,8.911,0,0,1,0,12.586A1,1,0,1,0,20.8,19.707,10.911,10.911,0,0,0,20.8,4.293Z"></path><path d="M18.093,7.293a1,1,0,1,0-1.414,1.414,4.664,4.664,0,0,1,0,6.586,1,1,0,1,0,1.414,1.414A6.665,6.665,0,0,0,18.093,7.293Z"></path><path d="M13.819.207A12.055,12.055,0,0,0,6.268,5H5a5.006,5.006,0,0,0-5,5v4a5.006,5.006,0,0,0,5,5H6.269a12.051,12.051,0,0,0,7.55,4.793A1,1,0,0,0,15,22.81V1.19A1,1,0,0,0,13.819.207Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-sr-messages"><path d="m13-.004H5C2.243-.004,0,2.239,0,4.996v12.854c0,.793.435,1.519,1.134,1.894.318.171.667.255,1.015.255.416,0,.831-.121,1.191-.36l3.963-2.643h5.697c2.757,0,5-2.243,5-5v-7C18,2.239,15.757-.004,13-.004Zm11,9v12.854c0,.793-.435,1.519-1.134,1.894-.318.171-.667.255-1.015.256-.416,0-.831-.121-1.19-.36l-3.964-2.644h-5.697c-1.45,0-2.747-.631-3.661-1.62l.569-.38h5.092c3.859,0,7-3.141,7-7v-7c0-.308-.027-.608-.065-.906,2.311.44,4.065,2.469,4.065,4.906Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-expand"><path d="M19,24H17a1,1,0,0,1,0-2h2a3,3,0,0,0,3-3V17a1,1,0,0,1,2,0v2A5.006,5.006,0,0,1,19,24Z"></path><path d="M1,8A1,1,0,0,1,0,7V5A5.006,5.006,0,0,1,5,0H7A1,1,0,0,1,7,2H5A3,3,0,0,0,2,5V7A1,1,0,0,1,1,8Z"></path><path d="M7,24H5a5.006,5.006,0,0,1-5-5V17a1,1,0,0,1,2,0v2a3,3,0,0,0,3,3H7a1,1,0,0,1,0,2Z"></path><path d="M23,8a1,1,0,0,1-1-1V5a3,3,0,0,0-3-3H17a1,1,0,0,1,0-2h2a5.006,5.006,0,0,1,5,5V7A1,1,0,0,1,23,8Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-sr-play"><path d="M20.492,7.969,10.954.975A5,5,0,0,0,3,5.005V19a4.994,4.994,0,0,0,7.954,4.03l9.538-6.994a5,5,0,0,0,0-8.062Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-broadcast-tower"><path d="m12,5.5c-1.93,0-3.5,1.57-3.5,3.5,0,1.582,1.056,2.923,2.5,3.354v10.646c0,.552.448,1,1,1s1-.448,1-1v-10.646c1.444-.431,2.5-1.772,2.5-3.354,0-1.93-1.57-3.5-3.5-3.5Zm0,5c-.827,0-1.5-.673-1.5-1.5s.673-1.5,1.5-1.5,1.5.673,1.5,1.5-.673,1.5-1.5,1.5Zm-4.243-5.667c-1.133,1.133-1.757,2.64-1.757,4.243s.624,3.109,1.757,4.243c.391.39.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-1.511-1.511-2.343-3.52-2.343-5.657s.832-4.146,2.343-5.657c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414Zm12.243,4.243c0,2.137-.832,4.146-2.343,5.657-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.024,0-1.414,1.133-1.133,1.757-2.64,1.757-4.243s-.624-3.109-1.757-4.243c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0c1.511,1.511,2.343,3.52,2.343,5.657Zm-15.071,7.071c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293C-1.164,12.882-1.164,5.269,3.515.59c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414c-3.898,3.899-3.898,10.243,0,14.142Zm15.557,1.414c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414,3.898-3.899,3.898-10.243,0-14.142-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0c4.679,4.678,4.679,12.292,0,16.97Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-prescription-bottle-pill"><path d="m9,22h-2c-1.654,0-3-1.346-3-3h3c.553,0,1-.447,1-1s-.447-1-1-1h-3v-2h3c.553,0,1-.447,1-1s-.447-1-1-1h-3v-2h3c.553,0,1-.447,1-1s-.447-1-1-1h-3v-3h14v1c0,.553.447,1,1,1s1-.447,1-1v-1.172c1.164-.413,2-1.524,2-2.828,0-1.654-1.346-3-3-3H3C1.346,0,0,1.346,0,3c0,1.304.836,2.415,2,2.828v13.172c0,2.757,2.243,5,5,5h2c.553,0,1-.447,1-1s-.447-1-1-1ZM3,2h16c.552,0,1,.448,1,1s-.448,1-1,1H3c-.552,0-1-.448-1-1s.448-1,1-1Zm14,8c-3.859,0-7,3.141-7,7s3.141,7,7,7,7-3.141,7-7-3.141-7-7-7Zm0,2c1.018,0,1.965.306,2.756.83l-6.926,6.926c-.524-.791-.83-1.738-.83-2.756,0-2.757,2.243-5,5-5Zm0,10c-1.018,0-1.965-.306-2.756-.83l6.926-6.926c.524.791.83,1.738.83,2.756,0,2.757-2.243,5-5,5Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-ban"><path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,2a9.949,9.949,0,0,1,6.324,2.262L4.262,18.324A9.992,9.992,0,0,1,12,2Zm0,20a9.949,9.949,0,0,1-6.324-2.262L19.738,5.676A9.992,9.992,0,0,1,12,22Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-calendar-clock"><path d="M17,10.039c-3.859,0-7,3.14-7,7,0,3.838,3.141,6.961,7,6.961s7-3.14,7-7c0-3.838-3.141-6.961-7-6.961Zm0,11.961c-2.757,0-5-2.226-5-4.961,0-2.757,2.243-5,5-5s5,2.226,5,4.961c0,2.757-2.243,5-5,5Zm1.707-4.707c.391,.391,.391,1.023,0,1.414-.195,.195-.451,.293-.707,.293s-.512-.098-.707-.293l-1-1c-.188-.188-.293-.442-.293-.707v-2c0-.552,.447-1,1-1s1,.448,1,1v1.586l.707,.707Zm5.293-10.293v2c0,.552-.447,1-1,1s-1-.448-1-1v-2c0-1.654-1.346-3-3-3H5c-1.654,0-3,1.346-3,3v1H11c.552,0,1,.448,1,1s-.448,1-1,1H2v9c0,1.654,1.346,3,3,3h4c.552,0,1,.448,1,1s-.448,1-1,1H5c-2.757,0-5-2.243-5-5V7C0,4.243,2.243,2,5,2h1V1c0-.552,.448-1,1-1s1,.448,1,1v1h8V1c0-.552,.447-1,1-1s1,.448,1,1v1h1c2.757,0,5,2.243,5,5Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-house-blank"><path d="M19,24H5c-2.757,0-5-2.243-5-5V9.724c0-1.665,.824-3.215,2.204-4.145L9.203,.855c1.699-1.146,3.895-1.146,5.594,0l7,4.724c1.379,.93,2.203,2.479,2.203,4.145v9.276c0,2.757-2.243,5-5,5ZM12,1.997c-.584,0-1.168,.172-1.678,.517L3.322,7.237c-.828,.558-1.322,1.487-1.322,2.486v9.276c0,1.654,1.346,3,3,3h14c1.654,0,3-1.346,3-3V9.724c0-.999-.494-1.929-1.321-2.486L13.678,2.514c-.51-.345-1.094-.517-1.678-.517Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-apps"><path d="M7,0H4A4,4,0,0,0,0,4V7a4,4,0,0,0,4,4H7a4,4,0,0,0,4-4V4A4,4,0,0,0,7,0ZM9,7A2,2,0,0,1,7,9H4A2,2,0,0,1,2,7V4A2,2,0,0,1,4,2H7A2,2,0,0,1,9,4Z"></path><path d="M20,0H17a4,4,0,0,0-4,4V7a4,4,0,0,0,4,4h3a4,4,0,0,0,4-4V4A4,4,0,0,0,20,0Zm2,7a2,2,0,0,1-2,2H17a2,2,0,0,1-2-2V4a2,2,0,0,1,2-2h3a2,2,0,0,1,2,2Z"></path><path d="M7,13H4a4,4,0,0,0-4,4v3a4,4,0,0,0,4,4H7a4,4,0,0,0,4-4V17A4,4,0,0,0,7,13Zm2,7a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V17a2,2,0,0,1,2-2H7a2,2,0,0,1,2,2Z"></path><path d="M20,13H17a4,4,0,0,0-4,4v3a4,4,0,0,0,4,4h3a4,4,0,0,0,4-4V17A4,4,0,0,0,20,13Zm2,7a2,2,0,0,1-2,2H17a2,2,0,0,1-2-2V17a2,2,0,0,1,2-2h3a2,2,0,0,1,2,2Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-receipt"><path d="M16,0H8A5.006,5.006,0,0,0,3,5V23a1,1,0,0,0,1.564.825L6.67,22.386l2.106,1.439a1,1,0,0,0,1.13,0l2.1-1.439,2.1,1.439a1,1,0,0,0,1.131,0l2.1-1.438,2.1,1.437A1,1,0,0,0,21,23V5A5.006,5.006,0,0,0,16,0Zm3,21.1-1.1-.752a1,1,0,0,0-1.132,0l-2.1,1.439-2.1-1.439a1,1,0,0,0-1.131,0l-2.1,1.439-2.1-1.439a1,1,0,0,0-1.129,0L5,21.1V5A3,3,0,0,1,8,2h8a3,3,0,0,1,3,3Z"></path><rect x="7" y="8" width="10" height="2" rx="1"></rect><rect x="7" y="12" width="8" height="2" rx="1"></rect></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-print"><path d="M19,6V4a4,4,0,0,0-4-4H9A4,4,0,0,0,5,4V6a5.006,5.006,0,0,0-5,5v5a5.006,5.006,0,0,0,5,5,3,3,0,0,0,3,3h8a3,3,0,0,0,3-3,5.006,5.006,0,0,0,5-5V11A5.006,5.006,0,0,0,19,6ZM7,4A2,2,0,0,1,9,2h6a2,2,0,0,1,2,2V6H7ZM17,21a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V17a1,1,0,0,1,1-1h8a1,1,0,0,1,1,1Zm5-5a3,3,0,0,1-3,3V17a3,3,0,0,0-3-3H8a3,3,0,0,0-3,3v2a3,3,0,0,1-3-3V11A3,3,0,0,1,5,8H19a3,3,0,0,1,3,3Z"></path><path d="M18,10H16a1,1,0,0,0,0,2h2a1,1,0,0,0,0-2Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-user"><path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z"></path><path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-letter-case"><path d="M7.4,5.553a1.041,1.041,0,0,0-1.789,0l-5.5,11a1,1,0,1,0,1.789.894L3.619,14H9.383l1.724,3.447a1,1,0,1,0,1.789-.894ZM4.619,12,6.5,8.236,8.383,12Z"></path><path d="M23,8a1,1,0,0,0-1,1v.026A4.948,4.948,0,0,0,19,8a5,5,0,0,0,0,10,4.948,4.948,0,0,0,3-1.026V17a1,1,0,0,0,2,0V9A1,1,0,0,0,23,8Zm-4,8a3,3,0,1,1,3-3A3,3,0,0,1,19,16Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-palette"><path d="M17.115,8.05A1.5,1.5,0,1,0,18.95,9.115,1.5,1.5,0,0,0,17.115,8.05Z"></path><path d="M12.115,5.05A1.5,1.5,0,1,0,13.95,6.115,1.5,1.5,0,0,0,12.115,5.05Z"></path><path d="M7.115,8.05A1.5,1.5,0,1,0,8.95,9.115,1.5,1.5,0,0,0,7.115,8.05Z"></path><path d="M7.115,14.05A1.5,1.5,0,1,0,8.95,15.115,1.5,1.5,0,0,0,7.115,14.05Z"></path><path d="M12.5.007A12,12,0,0,0,.083,12a12.014,12.014,0,0,0,12,12c.338,0,.67-.022,1-.05a1,1,0,0,0,.916-1l-.032-3.588A3.567,3.567,0,0,1,20.057,16.8l.1.1a1.912,1.912,0,0,0,1.769.521,1.888,1.888,0,0,0,1.377-1.177A11.924,11.924,0,0,0,24.08,11.7,12.155,12.155,0,0,0,12.5.007Zm8.982,15.4-.014-.014a5.567,5.567,0,0,0-9.5,3.985L11.992,22a10,10,0,0,1,.09-20c.117,0,.235,0,.353.006a10.127,10.127,0,0,1,9.645,9.743A9.892,9.892,0,0,1,21.485,15.4Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-exit"><path d="M22.829,9.172,18.95,5.293a1,1,0,0,0-1.414,1.414l3.879,3.879a2.057,2.057,0,0,1,.3.39c-.015,0-.027-.008-.042-.008h0L5.989,11a1,1,0,0,0,0,2h0l15.678-.032c.028,0,.051-.014.078-.016a2,2,0,0,1-.334.462l-3.879,3.879a1,1,0,1,0,1.414,1.414l3.879-3.879a4,4,0,0,0,0-5.656Z"></path><path d="M7,22H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H7A1,1,0,0,0,7,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H7a1,1,0,0,0,0-2Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-angle-left"><path d="M17.17,24a1,1,0,0,1-.71-.29L8.29,15.54a5,5,0,0,1,0-7.08L16.46.29a1,1,0,1,1,1.42,1.42L9.71,9.88a3,3,0,0,0,0,4.24l8.17,8.17a1,1,0,0,1,0,1.42A1,1,0,0,1,17.17,24Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-arrow-right"><path d="M23.12,9.91,19.25,6a1,1,0,0,0-1.42,0h0a1,1,0,0,0,0,1.41L21.39,11H1a1,1,0,0,0-1,1H0a1,1,0,0,0,1,1H21.45l-3.62,3.61a1,1,0,0,0,0,1.42h0a1,1,0,0,0,1.42,0l3.87-3.88A3,3,0,0,0,23.12,9.91Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-user-key"><path d="m20.061,12.939c.586.586.586,1.536,0,2.121-.586.586-1.536.586-2.121,0-.586-.586-.586-1.536,0-2.121s1.536-.586,2.121,0Zm2.328,5.449c-1.169,1.17-2.794,1.734-4.413,1.585l-3.133,3.133c-.559.559-1.331.879-2.121.879h-1.714c-1.096,0-1.992-.893-1.997-1.99l-.009-1.988c-.002-.401.153-.779.437-1.064s.661-.442,1.063-.442h.49l.004-.512c.006-.82.679-1.488,1.5-1.488h.762v-.393c-.71-2.311.136-4.764,2.138-6.15,1.805-1.251,4.244-1.286,6.071-.093,1.419.927,2.331,2.409,2.503,4.066.173,1.656-.404,3.282-1.581,4.459Zm-.408-4.253c-.11-1.07-.682-1.993-1.607-2.597-1.154-.754-2.696-.728-3.839.062-1.307.906-1.842,2.524-1.33,4.027.036.104.054.213.054.322v1.55c0,.553-.447,1-1,1h-1.265l-.007,1.008c-.004.549-.451.992-1,.992h-.98l.006,1.485h1.711c.263,0,.52-.106.707-.293l3.487-3.487c.236-.235.575-.342.901-.273,1.151.228,2.331-.13,3.157-.957.749-.749,1.115-1.784,1.006-2.839ZM2,6C2,2.691,4.691,0,8,0s6,2.691,6,6-2.691,6-6,6-6-2.691-6-6Zm2,0c0,2.206,1.794,4,4,4s4-1.794,4-4-1.794-4-4-4-4,1.794-4,4Zm5.99,9.213c.079-.546-.301-1.053-.848-1.132-.376-.054-.761-.081-1.142-.081C3.589,14,0,17.589,0,22v1c0,.553.448,1,1,1s1-.447,1-1v-1c0-3.309,2.691-6,6-6,.287,0,.575.021.858.062.544.073,1.054-.302,1.132-.849Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-users-alt"><path d="M12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,12,10Zm6,13A6,6,0,0,0,6,23a1,1,0,0,0,2,0,4,4,0,0,1,8,0,1,1,0,0,0,2,0ZM18,8a4,4,0,1,1,4-4A4,4,0,0,1,18,8Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,18,2Zm6,13a6.006,6.006,0,0,0-6-6,1,1,0,0,0,0,2,4,4,0,0,1,4,4,1,1,0,0,0,2,0ZM6,8a4,4,0,1,1,4-4A4,4,0,0,1,6,8ZM6,2A2,2,0,1,0,8,4,2,2,0,0,0,6,2ZM2,15a4,4,0,0,1,4-4A1,1,0,0,0,6,9a6.006,6.006,0,0,0-6,6,1,1,0,0,0,2,0Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-filter"><path d="m14 24a1 1 0 0 1 -.6-.2l-4-3a1 1 0 0 1 -.4-.8v-5.62l-7.016-7.893a3.9 3.9 0 0 1 2.916-6.487h14.2a3.9 3.9 0 0 1 2.913 6.488l-7.013 7.892v8.62a1 1 0 0 1 -1 1zm-3-4.5 2 1.5v-7a1 1 0 0 1 .253-.664l7.268-8.177a1.9 1.9 0 0 0 -1.421-3.159h-14.2a1.9 1.9 0 0 0 -1.421 3.158l7.269 8.178a1 1 0 0 1 .252.664z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-cross"><path d="M23.707.293h0a1,1,0,0,0-1.414,0L12,10.586,1.707.293a1,1,0,0,0-1.414,0h0a1,1,0,0,0,0,1.414L10.586,12,.293,22.293a1,1,0,0,0,0,1.414h0a1,1,0,0,0,1.414,0L12,13.414,22.293,23.707a1,1,0,0,0,1.414,0h0a1,1,0,0,0,0-1.414L13.414,12,23.707,1.707A1,1,0,0,0,23.707.293Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-calendar-lines-pen"><path d="M19,2h-1V1c0-.552-.448-1-1-1s-1,.448-1,1v1H8V1c0-.552-.448-1-1-1s-1,.448-1,1v1h-1C2.243,2,0,4.243,0,7v12c0,2.757,2.243,5,5,5h4c.552,0,1-.448,1-1s-.448-1-1-1H5c-1.654,0-3-1.346-3-3V10H23c.552,0,1-.448,1-1v-2c0-2.757-2.243-5-5-5Zm3,6H2v-1c0-1.654,1.346-3,3-3h14c1.654,0,3,1.346,3,3v1Zm-3.121,4.879l-5.707,5.707c-.755,.755-1.172,1.76-1.172,2.829v1.586c0,.552,.448,1,1,1h1.586c1.069,0,2.073-.417,2.828-1.172l5.707-5.707c.567-.567,.879-1.32,.879-2.122s-.312-1.555-.878-2.121c-1.134-1.134-3.11-1.134-4.243,0Zm2.828,2.828l-5.708,5.707c-.377,.378-.879,.586-1.414,.586h-.586v-.586c0-.534,.208-1.036,.586-1.414l5.708-5.707c.377-.378,1.036-.378,1.414,0,.189,.188,.293,.439,.293,.707s-.104,.518-.293,.707Zm-16.707-1.707c0-.552,.448-1,1-1h7c.552,0,1,.448,1,1s-.448,1-1,1H6c-.552,0-1-.448-1-1Zm6,4c0,.552-.448,1-1,1H6c-.552,0-1-.448-1-1s.448-1,1-1h4c.552,0,1,.448,1,1Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-menu-dots"><circle cx="2" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="22" cy="12" r="2"></circle></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-vote-nay"><path d="M20,12V7c0-2.76-2.24-5-5-5h-6c-2.76,0-5,2.24-5,5v5c-2.21,0-4,1.79-4,4v2c0,2.21,1.79,4,4,4H20c2.21,0,4-1.79,4-4v-2c0-2.21-1.79-4-4-4ZM6,7c0-1.65,1.35-3,3-3h6c1.65,0,3,1.35,3,3v9H6V7Zm16,11c0,1.1-.9,2-2,2H4c-1.1,0-2-.9-2-2v-2c0-1.1,.9-2,2-2v3c0,.55,.45,1,1,1h14c.55,0,1-.45,1-1v-3c1.1,0,2,.9,2,2v2Zm-12.71-6.71l1.29-1.29-1.29-1.29c-.39-.39-.39-1.02,0-1.41s1.02-.39,1.41,0l1.29,1.29,1.29-1.29c.39-.39,1.02-.39,1.41,0s.39,1.02,0,1.41l-1.29,1.29,1.29,1.29c.39,.39,.39,1.02,0,1.41-.2,.2-.45,.29-.71,.29s-.51-.1-.71-.29l-1.29-1.29-1.29,1.29c-.2,.2-.45,.29-.71,.29s-.51-.1-.71-.29c-.39-.39-.39-1.02,0-1.41Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-badge-percent"><path d="M12,24c-1.626,0-3.16-.714-4.208-1.959-1.54,.177-3.127-.406-4.277-1.555-1.149-1.15-1.729-2.74-1.59-4.362-1.211-.964-1.925-2.498-1.925-4.124s.714-3.16,1.96-4.208c-.175-1.537,.405-3.127,1.555-4.277,1.15-1.151,2.737-1.73,4.361-1.59,.964-1.21,2.498-1.925,4.124-1.925s3.16,.714,4.208,1.959c1.542-.176,3.127,.406,4.277,1.555,1.149,1.15,1.729,2.74,1.59,4.362,1.211,.964,1.925,2.498,1.925,4.124s-.714,3.16-1.96,4.208c.175,1.537-.405,3.127-1.555,4.277-1.151,1.15-2.741,1.729-4.361,1.59-.964,1.21-2.498,1.925-4.124,1.925Zm-4.127-3.924c.561,0,1.081,.241,1.448,.676,.668,.793,1.644,1.248,2.679,1.248s2.011-.455,2.679-1.248c.403-.479,.99-.721,1.616-.67,1.034,.087,2.044-.28,2.776-1.012,.731-.731,1.1-1.743,1.012-2.776-.054-.624,.19-1.213,.67-1.617,.792-.667,1.247-1.644,1.247-2.678s-.455-2.011-1.247-2.678c-.479-.403-.724-.993-.67-1.617,.088-1.033-.28-2.045-1.012-2.776s-1.748-1.096-2.775-1.012c-.626,.057-1.214-.191-1.617-.669-.668-.793-1.644-1.248-2.679-1.248s-2.011,.455-2.679,1.248c-.404,.479-.993,.719-1.616,.67-1.039-.09-2.044,.28-2.776,1.012-.731,.731-1.1,1.743-1.012,2.776,.054,.624-.19,1.213-.67,1.617-.792,.667-1.247,1.644-1.247,2.678s.455,2.011,1.247,2.678c.479,.403,.724,.993,.67,1.617-.088,1.033,.28,2.045,1.012,2.776,.732,.732,1.753,1.098,2.775,1.012,.057-.005,.113-.007,.169-.007Zm1.127-12.076c-.552,0-1,.448-1,1s.448,1,1,1,1-.448,1-1-.448-1-1-1Zm6,6c-.552,0-1,.448-1,1s.448,1,1,1,1-.448,1-1-.448-1-1-1Zm-4.168,1.555l4-6c.307-.459,.183-1.081-.277-1.387-.461-.308-1.081-.182-1.387,.277l-4,6c-.307,.459-.183,1.081,.277,1.387,.171,.114,.363,.168,.554,.168,.323,0,.641-.156,.833-.445Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-plus"><path d="M23,11H13V1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1V11H1a1,1,0,0,0-1,1H0a1,1,0,0,0,1,1H11V23a1,1,0,0,0,1,1h0a1,1,0,0,0,1-1V13H23a1,1,0,0,0,1-1h0A1,1,0,0,0,23,11Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-angle-small-left"><path d="M10.6,12.71a1,1,0,0,1,0-1.42l4.59-4.58a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L9.19,9.88a3,3,0,0,0,0,4.24l4.59,4.59a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-tags"><path d="M7.707,9.256c.391,.391,.391,1.024,0,1.414-.391,.391-1.024,.391-1.414,0-.391-.391-.391-1.024,0-1.414,.391-.391,1.024-.391,1.414,0Zm13.852,6.085l-.565,.565c-.027,1.233-.505,2.457-1.435,3.399l-3.167,3.208c-.943,.955-2.201,1.483-3.543,1.487h-.017c-1.335,0-2.59-.52-3.534-1.464L1.882,15.183c-.65-.649-.964-1.542-.864-2.453l.765-6.916c.051-.456,.404-.819,.858-.881l6.889-.942c.932-.124,1.87,.193,2.528,.851l7.475,7.412c.387,.387,.697,.823,.931,1.288,.812-1.166,.698-2.795-.342-3.835L12.531,2.302c-.229-.229-.545-.335-.851-.292l-6.889,.942c-.549,.074-1.052-.309-1.127-.855-.074-.547,.309-1.051,.855-1.126L11.409,.028c.921-.131,1.869,.191,2.528,.852l7.589,7.405c1.946,1.945,1.957,5.107,.032,7.057Zm-3.438-1.67l-7.475-7.412c-.223-.223-.536-.326-.847-.287l-6.115,.837-.679,6.14c-.033,.303,.071,.601,.287,.816l7.416,7.353c.569,.57,1.322,.881,2.123,.881h.01c.806-.002,1.561-.319,2.126-.893l3.167-3.208c1.155-1.17,1.149-3.067-.014-4.229Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-add-image"><path d="m12,21c0,.553-.448,1-1,1h-6c-2.757,0-5-2.243-5-5V5C0,2.243,2.243,0,5,0h12c2.757,0,5,2.243,5,5v6c0,.553-.448,1-1,1s-1-.447-1-1v-6c0-1.654-1.346-3-3-3H5c-1.654,0-3,1.346-3,3v6.959l2.808-2.808c1.532-1.533,4.025-1.533,5.558,0l5.341,5.341c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-5.341-5.341c-.752-.751-1.976-.752-2.73,0l-4.222,4.222v2.213c0,1.654,1.346,3,3,3h6c.552,0,1,.447,1,1ZM15,3.5c1.654,0,3,1.346,3,3s-1.346,3-3,3-3-1.346-3-3,1.346-3,3-3Zm0,2c-.551,0-1,.448-1,1s.449,1,1,1,1-.448,1-1-.449-1-1-1Zm8,12.5h-3v-3c0-.553-.448-1-1-1s-1,.447-1,1v3h-3c-.552,0-1,.447-1,1s.448,1,1,1h3v3c0,.553.448,1,1,1s1-.447,1-1v-3h3c.552,0,1-.447,1-1s-.448-1-1-1Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-trash"><path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"></path><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"></path><path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-refresh"><path d="M12,2a10.032,10.032,0,0,1,7.122,3H16a1,1,0,0,0-1,1h0a1,1,0,0,0,1,1h4.143A1.858,1.858,0,0,0,22,5.143V1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1V3.078A11.981,11.981,0,0,0,.05,10.9a1.007,1.007,0,0,0,1,1.1h0a.982.982,0,0,0,.989-.878A10.014,10.014,0,0,1,12,2Z"></path><path d="M22.951,12a.982.982,0,0,0-.989.878A9.986,9.986,0,0,1,4.878,19H8a1,1,0,0,0,1-1H9a1,1,0,0,0-1-1H3.857A1.856,1.856,0,0,0,2,18.857V23a1,1,0,0,0,1,1H3a1,1,0,0,0,1-1V20.922A11.981,11.981,0,0,0,23.95,13.1a1.007,1.007,0,0,0-1-1.1Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-basket-shopping-simple"><path d="M23.27,9.03c-.57-.66-1.4-1.03-2.27-1.03h-.09C20.41,3.51,16.59,0,11.97,0S3.52,3.51,3.02,8h-.05c-.87,0-1.7,.38-2.27,1.03C.13,9.69-.12,10.56,0,11.42l1.06,7.42c.42,2.94,2.97,5.15,5.94,5.15h9.97c2.97,0,5.52-2.21,5.94-5.15l1.06-7.42c.12-.86-.13-1.73-.7-2.39ZM11.97,2c3.52,0,6.44,2.61,6.93,6H5.04c.49-3.39,3.41-6,6.93-6Zm10.02,9.14l-1.06,7.42c-.28,1.96-1.98,3.43-3.96,3.43H7c-1.98,0-3.68-1.48-3.96-3.43l-1.06-7.42c-.04-.29,.04-.57,.23-.8,.19-.22,.46-.35,.76-.35H21c.29,0,.56,.12,.75,.34,.19,.22,.28,.51,.23,.8Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-point-of-sale-bill"><path d="m11,10v1c0,.552-.448,1-1,1h-5c-.552,0-1-.448-1-1v-1c0-.552.448-1,1-1h5c.552,0,1,.448,1,1Zm13-3.5v10.5c0,.357-.19.688-.5.866-.309.178-.69.178-.999,0l-2.17-1.25-1.767,1.209c-.172.118-.369.175-.563.175-.319,0-.633-.152-.826-.436-.312-.455-.195-1.077.261-1.39l2.285-1.564c.315-.217.731-.234,1.063-.041l1.216.7V6.5c0-2.481-2.019-4.5-4.5-4.5-2.249,0-4.097,1.624-4.431,3.815,1.164.814,1.931,2.16,1.931,3.685v10c0,2.481-2.019,4.5-4.5,4.5h-6c-2.481,0-4.5-2.019-4.5-4.5v-10c0-1.557.795-2.93,2-3.738v-.762C2,2.243,4.243,0,7,0h10.5c3.584,0,6.5,2.916,6.5,6.5Zm-11,3c0-1.379-1.121-2.5-2.5-2.5h-6c-1.379,0-2.5,1.121-2.5,2.5v10c0,1.379,1.121,2.5,2.5,2.5h6c1.379,0,2.5-1.121,2.5-2.5v-10Zm-1.836-4.433c.263-1.183.837-2.233,1.635-3.067h-5.799c-1.654,0-3,1.346-3,3v.051c.166-.019.329-.051.5-.051h6c.227,0,.446.034.664.067Zm-1.164,8.933h-1c-.553,0-1,.447-1,1s.447,1,1,1h1c.553,0,1-.447,1-1s-.447-1-1-1Zm0,4h-1c-.553,0-1,.447-1,1s.447,1,1,1h1c.553,0,1-.447,1-1s-.447-1-1-1Zm-4-4h-1c-.553,0-1,.447-1,1s.447,1,1,1h1c.553,0,1-.447,1-1s-.447-1-1-1Zm0,4h-1c-.553,0-1,.447-1,1s.447,1,1,1h1c.553,0,1-.447,1-1s-.447-1-1-1Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-minus-small"><rect x="6" y="11" width="12" height="2" rx="1"></rect></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-plus-small"><path d="M17,11H13V7a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1v4H7a1,1,0,0,0-1,1H6a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h0a1,1,0,0,0,1-1V13h4a1,1,0,0,0,1-1h0A1,1,0,0,0,17,11Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-search"><path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-menu-dots-vertical"><circle cx="12" cy="2" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="22" r="2"></circle></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-pencil"><path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-refund-alt"><path d="m18,7h2.666c-1.943-3.389-5.697-5.375-9.776-4.941C6.32,2.546,2.598,6.247,2.069,10.812c-.7,6.042,4.026,11.188,9.931,11.188,5.514,0,10-4.486,10-10,0-.553.447-1,1-1s1,.447,1,1c0,6.774-5.641,12.255-12.473,11.991C5.355,23.752.248,18.646.009,12.475-.256,5.642,5.226,0,12,0c4.104,0,7.805,2.034,9.995,5.345l.005-2.345c0-.553.447-1,1-1s1,.447,1,1v3.991c0,1.109-.899,2.009-2.009,2.009h-3.991c-.553,0-1-.447-1-1s.447-1,1-1Zm-6,12c.552,0,1-.447,1-1v-1c1.654,0,3-1.346,3-3,0-1.359-.974-2.51-2.315-2.733l-3.041-.506c-.373-.062-.644-.382-.644-.761,0-.552.449-1,1-1h2.268c.356,0,.688.191.867.501.274.478.886.642,1.366.364.478-.276.642-.888.364-1.366-.534-.925-1.53-1.499-2.598-1.499h-.268v-1c0-.553-.448-1-1-1s-1,.447-1,1v1c-1.654,0-3,1.346-3,3,0,1.359.974,2.51,2.315,2.733l3.04.506c.374.062.645.382.645.761,0,.552-.448,1-1,1h-2.268c-.356,0-.688-.191-.867-.501-.277-.479-.889-.643-1.366-.364-.479.276-.642.888-.365,1.366.535.925,1.531,1.499,2.598,1.499h.268v1c0,.553.448,1,1,1Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-point-of-sale-bill"><path d="m11,10v1c0,.552-.448,1-1,1h-5c-.552,0-1-.448-1-1v-1c0-.552.448-1,1-1h5c.552,0,1,.448,1,1Zm13-3.5v10.5c0,.357-.19.688-.5.866-.309.178-.69.178-.999,0l-2.17-1.25-1.767,1.209c-.172.118-.369.175-.563.175-.319,0-.633-.152-.826-.436-.312-.455-.195-1.077.261-1.39l2.285-1.564c.315-.217.731-.234,1.063-.041l1.216.7V6.5c0-2.481-2.019-4.5-4.5-4.5-2.249,0-4.097,1.624-4.431,3.815,1.164.814,1.931,2.16,1.931,3.685v10c0,2.481-2.019,4.5-4.5,4.5h-6c-2.481,0-4.5-2.019-4.5-4.5v-10c0-1.557.795-2.93,2-3.738v-.762C2,2.243,4.243,0,7,0h10.5c3.584,0,6.5,2.916,6.5,6.5Zm-11,3c0-1.379-1.121-2.5-2.5-2.5h-6c-1.379,0-2.5,1.121-2.5,2.5v10c0,1.379,1.121,2.5,2.5,2.5h6c1.379,0,2.5-1.121,2.5-2.5v-10Zm-1.836-4.433c.263-1.183.837-2.233,1.635-3.067h-5.799c-1.654,0-3,1.346-3,3v.051c.166-.019.329-.051.5-.051h6c.227,0,.446.034.664.067Zm-1.164,8.933h-1c-.553,0-1,.447-1,1s.447,1,1,1h1c.553,0,1-.447,1-1s-.447-1-1-1Zm0,4h-1c-.553,0-1,.447-1,1s.447,1,1,1h1c.553,0,1-.447,1-1s-.447-1-1-1Zm-4-4h-1c-.553,0-1,.447-1,1s.447,1,1,1h1c.553,0,1-.447,1-1s-.447-1-1-1Zm0,4h-1c-.553,0-1,.447-1,1s.447,1,1,1h1c.553,0,1-.447,1-1s-.447-1-1-1Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-hamburger-soda"><path d="M19,12H16.386l.54-4.331A3.017,3.017,0,0,0,14,4.017H11.631c.109-.771.043-2.007,1.134-2.012H16a1,1,0,1,0,0-2H12.765A3,3,0,0,0,9.79,2.633L9.617,4.017H3A3.021,3.021,0,0,0,.059,7.572L1.572,19.63a5.005,5.005,0,0,0,4.959,4.376L19,23.994a5,5,0,0,0,5-5V17A5,5,0,0,0,19,12Zm3,5H10a3,3,0,0,1,3-3h6A3,3,0,0,1,22,17ZM14,6.016a1.011,1.011,0,0,1,.96,1.311L14.873,8h-3.74l.248-1.986ZM2.224,6.39A1,1,0,0,1,3,6.016H9.367L9.118,8H2.124l-.1-.77A.993.993,0,0,1,2.224,6.39ZM3.556,19.382,2.376,10H14.623l-.251,2H13a5,5,0,0,0-5,5c-.042,1.634-.1,3.74,1.036,5.01H6.531A3,3,0,0,1,3.556,19.382ZM19,22H13a3,3,0,0,1-3-3h3.7c.387.186,2.875,2.111,3.3,2,.416.118,2.93-1.823,3.3-2H22A3,3,0,0,1,19,22Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-angle-right"><path d="M7,24a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l8.17-8.17a3,3,0,0,0,0-4.24L6.29,1.71A1,1,0,0,1,7.71.29l8.17,8.17a5,5,0,0,1,0,7.08L7.71,23.71A1,1,0,0,1,7,24Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-angle-small-up"><path d="M18,15.5a1,1,0,0,1-.71-.29l-4.58-4.59a1,1,0,0,0-1.42,0L6.71,15.21a1,1,0,0,1-1.42-1.42L9.88,9.21a3.06,3.06,0,0,1,4.24,0l4.59,4.58a1,1,0,0,1,0,1.42A1,1,0,0,1,18,15.5Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-angle-small-down"><path d="M18.71,8.21a1,1,0,0,0-1.42,0l-4.58,4.58a1,1,0,0,1-1.42,0L6.71,8.21a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41l4.59,4.59a3,3,0,0,0,4.24,0l4.59-4.59A1,1,0,0,0,18.71,8.21Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-chart-histogram"><path d="M23,22H5a3,3,0,0,1-3-3V1A1,1,0,0,0,0,1V19a5.006,5.006,0,0,0,5,5H23a1,1,0,0,0,0-2Z"></path><path d="M6,20a1,1,0,0,0,1-1V12a1,1,0,0,0-2,0v7A1,1,0,0,0,6,20Z"></path><path d="M10,10v9a1,1,0,0,0,2,0V10a1,1,0,0,0-2,0Z"></path><path d="M15,13v6a1,1,0,0,0,2,0V13a1,1,0,0,0-2,0Z"></path><path d="M20,9V19a1,1,0,0,0,2,0V9a1,1,0,0,0-2,0Z"></path><path d="M6,9a1,1,0,0,0,.707-.293l3.586-3.586a1.025,1.025,0,0,1,1.414,0l2.172,2.172a3,3,0,0,0,4.242,0l5.586-5.586A1,1,0,0,0,22.293.293L16.707,5.878a1,1,0,0,1-1.414,0L13.121,3.707a3,3,0,0,0-4.242,0L5.293,7.293A1,1,0,0,0,6,9Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-money-bill-wave"><path d="M12,16c-2.206,0-4-1.794-4-4s1.794-4,4-4,4,1.794,4,4-1.794,4-4,4Zm0-6c-1.103,0-2,.897-2,2s.897,2,2,2,2-.897,2-2-.897-2-2-2Zm-7-3c-.552,0-1,.448-1,1s.448,1,1,1,1-.448,1-1-.448-1-1-1Zm13,3c0,.552,.448,1,1,1s1-.448,1-1-.448-1-1-1-1,.448-1,1Zm-13,3c-.552,0-1,.448-1,1s.448,1,1,1,1-.448,1-1-.448-1-1-1Zm13,3c0,.552,.448,1,1,1s1-.448,1-1-.448-1-1-1-1,.448-1,1Zm-1.001,5c-1.634,0-3.098-.399-4.513-.785-1.348-.368-2.62-.715-3.986-.715-1.571,0-2.562,.101-3.419,.349-1.206,.347-2.474,.113-3.48-.644-1.017-.765-1.6-1.933-1.6-3.205v-7.548c0-2.063,1.299-3.944,3.233-4.681,1.341-.512,2.609-.771,3.768-.771,1.634,0,3.097,.399,4.513,.785,1.348,.368,2.62,.715,3.986,.715,1.57,0,2.562-.101,3.419-.349,1.208-.347,2.476-.113,3.481,.644,1.017,.765,1.6,1.933,1.6,3.205v7.548h0c0,2.063-1.3,3.944-3.234,4.681-1.341,.512-2.608,.771-3.768,.771Zm-8.499-3.5c1.634,0,3.097,.399,4.513,.785,1.348,.368,2.62,.715,3.986,.715,.914,0,1.942-.215,3.056-.64,1.183-.45,1.946-1.554,1.946-2.812v-7.548c0-.637-.293-1.223-.803-1.606-.499-.375-1.126-.493-1.725-.321-1.051,.303-2.202,.427-3.974,.427-1.634,0-3.097-.399-4.513-.785-1.348-.368-2.62-.715-3.986-.715-.915,0-1.942,.215-3.056,.64-1.183,.45-1.946,1.554-1.946,2.812v7.548c0,.637,.293,1.223,.803,1.606,.499,.375,1.126,.493,1.724,.32,1.051-.303,2.203-.427,3.974-.427Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-digital-wallet"><path d="M24,7v10c0,1.654-1.346,3-3,3h-5.5c-.553,0-1-.448-1-1s.447-1,1-1h5.5c.552,0,1-.449,1-1V7c0-.551-.448-1-1-1H6c-1.096,0-2.146-.366-2.999-1.005,0,.002,0,.004,0,.005v3c0,.552-.447,1-1,1s-1-.448-1-1v-3C1.02,2.304,3.224-.006,6,0H23c.553,0,1,.448,1,1s-.447,1-1,1H6c-.881,0-1.667,.389-2.217,.996,.563,.623,1.361,1.004,2.217,1.004h15c1.654,0,3,1.346,3,3Zm-4,5c0-.828-.672-1.5-1.5-1.5s-1.5,.672-1.5,1.5,.672,1.5,1.5,1.5,1.5-.672,1.5-1.5ZM1.5,21c-.828,0-1.5,.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Zm-.5-5c-.553,0-1,.448-1,1s.447,1,1,1c2.757,0,5,2.243,5,5,0,.552,.447,1,1,1s1-.448,1-1c0-3.86-3.141-7-7-7Zm0-5c-.553,0-1,.448-1,1s.447,1,1,1c5.514,0,10,4.486,10,10,0,.552,.447,1,1,1s1-.448,1-1c0-6.617-5.383-12-12-12Z"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-rr-credit-card"><circle cx="5.5" cy="15.5" r="1.5"></circle><path d="M19,3H5A5.006,5.006,0,0,0,0,8v8a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V8A5.006,5.006,0,0,0,19,3ZM5,5H19a3,3,0,0,1,3,3H2A3,3,0,0,1,5,5ZM19,19H5a3,3,0,0,1-3-3V10H22v6A3,3,0,0,1,19,19Z"></path></svg>',
    '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet" data-svg-name="custom icon-ghost"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none"><path d="M2768 4990 c-70 -12 -166 -46 -225 -80 -62 -35 -159 -124 -198 -179 -90 -131 -6 -302 147 -301 65 1 117 29 166 92 52 67 101 103 165 119 41 10 58 9 114 -6 122 -33 187 -132 162 -244 -14 -62 -31 -91 -82 -138 -53 -49 -78 -63 -200 -109 -182 -69 -235 -116 -274 -243 l-17 -54 -90 7 c-49 3 -190 6 -313 6 l-224 0 44 58 c78 101 107 179 107 289 0 203 -136 369 -342 418 -118 28 -241 11 -367 -51 -161 -79 -280 -262 -281 -429 0 -67 26 -114 80 -142 53 -28 82 -29 136 -3 55 27 72 55 88 143 21 118 54 163 140 187 62 17 112 6 152 -34 67 -67 67 -171 1 -267 -49 -72 -102 -151 -119 -179 -14 -23 -26 -27 -119 -39 -337 -41 -709 -150 -917 -268 -96 -54 -201 -146 -237 -207 -47 -80 -49 -115 -25 -338 85 -803 236 -1502 448 -2085 74 -202 166 -416 201 -467 67 -97 188 -170 347 -210 585 -147 1203 -150 1798 -10 136 32 218 69 285 130 73 66 108 121 167 264 l51 125 104 6 c128 7 171 22 328 111 386 220 659 523 827 917 74 171 97 273 97 431 2 213 -47 348 -175 485 -156 167 -386 217 -601 130 l-60 -24 7 62 c3 34 9 135 12 224 l7 162 -28 58 c-89 183 -399 347 -845 447 -64 14 -150 31 -193 38 -42 6 -74 15 -70 18 5 4 51 21 103 39 172 59 248 101 326 183 167 177 202 410 93 625 -117 231 -429 379 -701 333z m248 -100 c120 -31 192 -69 273 -145 102 -97 144 -183 149 -311 4 -74 0 -107 -17 -162 -22 -74 -83 -166 -142 -216 -44 -38 -152 -88 -286 -132 -160 -53 -185 -70 -219 -149 -44 -106 -98 -132 -155 -76 -35 36 -36 46 -3 143 45 135 77 164 257 228 211 76 317 199 317 368 0 167 -139 294 -322 294 -101 0 -169 -35 -261 -133 -66 -71 -77 -79 -111 -79 -48 0 -82 23 -96 65 -15 46 4 89 73 158 144 144 343 198 543 147z m-1244 -378 c77 -38 130 -92 166 -171 21 -45 26 -71 26 -136 0 -104 -23 -154 -138 -300 -47 -60 -89 -123 -92 -140 -3 -16 -1 -50 5 -74 12 -54 0 -88 -33 -97 -54 -13 -81 29 -93 147 -6 64 5 91 72 179 23 30 55 80 71 110 25 48 29 66 29 140 0 69 -5 93 -22 127 -57 106 -175 148 -302 106 -102 -33 -162 -114 -180 -244 -9 -68 -26 -89 -73 -89 -15 0 -37 9 -49 21 -18 18 -20 28 -14 77 17 139 103 265 225 327 79 41 142 55 240 52 85 -2 103 -6 162 -35z m738 -802 c40 -119 162 -164 261 -97 28 19 69 74 82 110 4 13 256 -31 422 -73 408 -104 661 -250 714 -411 12 -36 4 -208 -19 -439 -9 -90 -2 -120 28 -120 9 0 53 18 97 40 120 60 233 75 348 45 80 -21 125 -46 188 -103 108 -99 168 -237 176 -403 9 -172 -26 -315 -127 -524 -84 -173 -158 -282 -293 -435 -158 -177 -446 -379 -628 -440 -66 -23 -180 -31 -231 -17 -18 5 -31 2 -41 -7 -8 -8 -38 -75 -67 -148 -63 -157 -102 -222 -161 -270 -63 -51 -113 -74 -225 -102 -255 -64 -497 -96 -789 -103 -323 -8 -605 19 -905 87 -157 35 -227 62 -289 108 -91 69 -110 102 -206 346 -251 642 -387 1200 -490 2011 -46 364 -52 450 -32 497 86 204 527 384 1154 472 46 7 43 11 69 -99 19 -82 68 -125 144 -125 96 0 147 66 135 176 -3 35 -4 68 0 74 4 7 116 9 336 8 l330 -3 19 -55z"></path><path d="M2408 3520 c-98 -52 -154 -213 -105 -306 84 -161 306 -163 390 -4 25 49 28 63 25 127 -3 61 -8 78 -35 115 -43 60 -100 88 -177 88 -40 -1 -73 -7 -98 -20z m172 -89 c33 -24 50 -58 50 -104 0 -44 -12 -70 -48 -109 -48 -51 -128 -45 -178 15 -23 27 -26 38 -22 89 3 44 10 64 29 84 50 54 114 64 169 25z"></path><path d="M1705 3436 c-43 -18 -93 -79 -101 -121 -23 -125 56 -227 176 -227 81 0 149 53 171 134 21 80 -36 188 -114 217 -38 15 -95 13 -132 -3z m123 -91 c57 -48 48 -138 -17 -164 -52 -22 -104 7 -120 66 -13 44 3 89 38 108 38 21 66 18 99 -10z"></path><path d="M4165 2527 c-139 -46 -255 -166 -288 -299 -9 -34 -26 -117 -37 -183 -44 -255 -133 -574 -241 -863 -21 -57 -22 -63 -7 -79 22 -21 105 -28 167 -13 153 37 465 294 601 495 152 225 237 493 209 663 -19 120 -88 225 -177 268 -47 23 -171 29 -227 11z m211 -109 c122 -82 144 -255 62 -488 -93 -267 -275 -494 -534 -666 -102 -68 -197 -114 -210 -101 -3 3 17 71 45 152 85 245 180 627 206 825 13 100 71 196 151 253 61 43 98 55 170 56 54 1 68 -3 110 -31z"></path><path d="M1065 2012 c-87 -41 -145 -143 -131 -234 20 -129 153 -221 274 -189 97 27 161 103 169 202 4 57 2 70 -24 119 -39 74 -101 113 -187 117 -44 3 -72 -2 -101 -15z"></path><path d="M2655 1920 c-83 -26 -145 -117 -145 -214 0 -230 305 -307 415 -105 24 44 27 59 23 118 -7 122 -85 203 -202 208 -33 1 -74 -2 -91 -7z"></path><path d="M1468 1260 c-25 -26 -29 -36 -24 -63 14 -68 9 -67 428 -114 468 -52 489 -52 517 -17 33 43 24 101 -19 124 -17 9 -793 100 -852 100 -11 0 -33 -14 -50 -30z"></path></g></svg>',
    '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"  width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"  preserveAspectRatio="xMidYMid meet" data-svg-name="custom icon-scared-warning">  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none"> <path d="M800 5088 c-16 -27 -20 -51 -20 -133 l-1 -100 -35 90 c-19 49 -45 100 -56 112 -26 27 -59 30 -80 6 -30 -35 -30 -87 -3 -253 l6 -35 -22 40 c-56 102 -101 134 -139 100 -25 -22 -26 -79 -5 -220 16 -110 46 -219 77 -278 28 -57 94 -124 133 -137 l34 -11 -15 -34 c-7 -19 -11 -41 -8 -50 8 -21 45 -35 90 -35 19 0 47 -8 61 -17 20 -13 48 -18 102 -18 48 0 76 -4 78 -12 2 -6 -23 -41 -55 -77 -77 -85 -95 -124 -90 -192 8 -94 79 -156 195 -170 95 -11 96 -11 89 -49 -4 -19 -23 -69 -43 -112 -31 -64 -37 -88 -37 -142 -1 -122 50 -174 177 -180 58 -2 80 -7 84 -18 3 -9 -4 -51 -17 -94 -30 -106 -26 -213 11 -285 l26 -51 -463 -662 -464 -663 32 -53 31 -53 256 -6 c141 -3 560 -11 931 -17 599 -10 676 -13 685 -27 26 -41 165 -298 165 -304 0 -13 -148 -9 -245 6 -49 8 -141 24 -203 36 -62 13 -115 21 -118 18 -3 -3 -32 -149 -65 -324 -33 -176 -73 -386 -89 -469 -15 -82 -26 -152 -25 -154 8 -7 160 50 219 83 80 45 168 139 190 202 24 72 21 181 -9 270 -14 41 -25 76 -25 77 0 2 39 -3 88 -9 48 -7 163 -17 256 -21 l168 -8 53 -125 c29 -69 85 -215 125 -325 40 -110 74 -202 75 -203 4 -4 846 317 855 325 12 12 -161 160 -225 193 -94 48 -188 54 -269 17 -61 -28 -131 -93 -175 -162 l-29 -45 -12 32 c-7 18 -39 95 -72 170 -32 75 -58 139 -58 141 0 2 33 10 73 17 280 49 475 241 494 488 l6 72 281 -6 c830 -18 1076 -19 1071 -5 -3 8 -231 362 -506 788 l-501 773 16 47 c20 58 20 163 1 227 -18 60 -20 116 -2 117 6 1 37 0 68 -1 71 -2 128 25 160 77 37 58 33 156 -9 247 -38 83 -51 146 -31 146 51 1 156 23 189 40 48 24 90 84 97 138 7 53 -23 119 -86 185 -29 30 -51 63 -51 75 0 20 5 22 73 20 52 -2 81 3 104 15 18 9 52 17 76 17 73 0 93 32 63 101 -5 12 0 18 23 22 69 14 147 121 190 259 44 146 65 350 39 376 -30 30 -91 -9 -142 -91 -32 -51 -11 -38 25 16 41 63 79 88 103 68 45 -38 -14 -369 -90 -498 -35 -61 -91 -112 -131 -119 -18 -3 -52 -2 -75 4 -23 6 -44 9 -46 7 -2 -2 14 -9 36 -14 48 -13 64 -30 65 -72 3 -48 -17 -55 -110 -42 -115 17 -241 60 -275 93 -34 35 -35 51 -4 87 23 27 24 27 62 11 42 -18 94 -31 94 -24 0 3 -24 11 -53 20 -109 32 -179 128 -197 272 -14 113 10 244 47 258 40 16 116 -78 137 -168 4 -15 9 -26 11 -24 2 2 17 67 33 144 42 201 83 285 130 269 27 -8 42 -55 41 -124 0 -77 -33 -266 -45 -264 -5 1 -23 5 -39 9 -17 4 -28 4 -25 1 7 -8 303 -97 308 -93 2 2 -12 9 -32 16 l-34 11 24 55 c13 31 22 59 19 64 -3 5 2 37 10 72 22 94 20 183 -5 208 -11 11 -27 20 -36 20 -29 0 -70 -57 -103 -142 -18 -46 -35 -85 -37 -87 -1 -2 -1 43 2 100 5 93 3 107 -15 137 -59 92 -128 -12 -176 -267 l-18 -94 -27 57 c-44 91 -89 128 -131 105 -25 -13 -38 -47 -50 -129 -19 -127 21 -278 90 -344 l29 -28 -24 -35 c-26 -39 -29 -55 -14 -83 7 -13 5 -21 -7 -31 -25 -21 -53 -90 -53 -132 0 -54 20 -94 84 -165 86 -97 78 -112 -73 -130 -89 -11 -118 -28 -148 -86 -25 -48 -13 -166 26 -246 32 -67 41 -129 19 -131 -7 -1 -45 -2 -85 -3 -85 -1 -116 -19 -150 -86 -27 -52 -29 -111 -8 -190 8 -30 13 -55 11 -57 -2 -2 -42 58 -91 132 -48 75 -86 137 -84 139 2 2 29 19 59 38 259 164 306 519 99 751 l-48 54 66 78 c37 43 62 76 57 74 -6 -2 -39 -36 -73 -76 l-61 -72 -48 30 c-49 31 -157 69 -198 69 -23 0 -24 3 -26 83 l-2 82 -5 -80 -6 -80 -70 -7 c-74 -7 -138 -26 -192 -58 l-33 -19 -47 80 c-25 43 -48 78 -50 75 -2 -2 17 -39 42 -81 38 -64 44 -81 33 -91 -7 -7 -19 -14 -26 -16 -7 -2 -70 86 -145 202 l-133 205 -65 3 -64 3 -143 -205 -143 -206 -30 22 c-34 25 -33 28 19 106 52 77 57 86 45 79 -6 -4 -32 -41 -58 -82 l-46 -75 -42 22 c-58 29 -132 48 -193 48 l-52 0 -10 83 -11 82 5 -81 5 -81 -40 -7 c-59 -9 -141 -42 -195 -78 -26 -17 -51 -27 -55 -22 -4 5 -29 37 -55 72 -26 34 -50 62 -53 62 -3 0 -1 -6 4 -12 5 -7 31 -41 57 -76 l47 -62 -41 -48 c-82 -92 -120 -196 -120 -330 0 -178 81 -317 249 -428 2 -2 -61 -94 -138 -205 -78 -111 -140 -203 -138 -205 2 -3 68 87 147 200 l142 204 39 -17 c21 -9 38 -19 36 -22 -5 -15 -1342 -1948 -1347 -1948 -3 0 -17 19 -31 43 l-27 44 519 741 c443 632 518 744 509 760 -14 28 -12 79 6 141 22 74 16 179 -12 217 -34 45 -81 67 -149 69 -33 0 -66 2 -72 2 -23 3 -14 56 23 132 60 123 58 234 -4 294 -23 21 -46 29 -114 40 -93 15 -128 29 -128 50 0 8 29 45 65 84 73 78 85 103 85 171 0 35 -8 59 -30 94 -23 37 -28 52 -21 70 10 25 -8 79 -29 92 -8 5 -1 19 24 44 19 20 47 62 61 93 54 119 49 342 -9 380 -37 25 -94 -19 -134 -102 l-28 -59 -18 107 c-24 139 -50 224 -82 262 -33 39 -59 38 -84 -2z m74 3 c29 -31 54 -112 81 -257 14 -75 25 -142 25 -148 0 -6 11 14 24 45 32 79 61 123 91 139 56 30 87 -33 86 -175 -1 -193 -78 -314 -224 -351 -51 -14 -51 -14 -8 -9 24 3 56 12 71 20 25 13 29 12 48 -8 62 -67 12 -116 -157 -156 -138 -33 -192 -36 -220 -14 -22 18 -22 20 -8 56 13 31 23 38 62 48 25 6 44 13 42 16 -3 2 -25 -1 -50 -8 -63 -15 -106 1 -156 58 -70 78 -122 250 -137 448 -10 127 23 161 87 88 30 -35 109 -187 109 -211 0 -6 -14 -13 -31 -17 -17 -4 -28 -9 -26 -12 6 -5 297 74 306 83 3 4 -7 4 -24 0 -16 -4 -34 -8 -39 -9 -26 -5 -47 313 -25 356 22 41 47 47 73 18z m-180 -61 c11 -19 35 -72 52 -119 18 -46 34 -78 36 -70 3 8 3 4 1 -9 -2 -12 3 -45 11 -72 l15 -50 -52 -14 c-116 -33 -101 -43 -132 85 -30 125 -36 232 -17 267 20 35 61 26 86 -18z m3900 18 c25 -35 19 -123 -14 -254 -17 -65 -33 -120 -36 -123 -5 -6 -81 13 -123 31 l-30 13 33 95 c46 136 85 218 114 241 31 24 37 24 56 -3z m-1917 -550 c-73 -112 -299 -434 -305 -436 -5 -1 -18 11 -30 27 l-22 30 141 201 140 200 46 0 c45 0 45 0 30 -22z m172 -186 c72 -112 131 -207 131 -211 0 -4 -9 -16 -21 -27 -11 -10 -37 -45 -56 -77 -20 -32 -39 -54 -43 -50 -3 4 -44 66 -90 136 -46 70 -87 124 -91 120 -4 -4 -54 -76 -111 -160 l-105 -152 -40 78 -40 78 65 94 c196 284 264 380 267 377 1 -2 61 -94 134 -206z m-650 -133 c79 -36 175 -131 214 -213 108 -221 45 -468 -157 -617 -46 -34 -56 -36 -56 -9 0 11 -5 39 -12 63 -9 37 -9 51 5 86 25 61 21 81 -24 149 -37 55 -41 66 -35 104 20 141 20 140 -13 188 -34 49 -38 82 -16 120 23 40 19 122 -7 150 l-22 23 30 -7 c16 -4 58 -20 93 -37z m-395 -3 c-45 -45 -47 -96 -4 -163 34 -53 36 -72 14 -114 -23 -45 -20 -98 10 -157 32 -64 32 -78 0 -154 -28 -68 -27 -89 11 -147 21 -30 24 -47 22 -99 -2 -70 -1 -70 -94 -26 -158 75 -263 246 -263 428 0 194 105 362 275 442 66 31 69 30 29 -10z m1388 6 c-44 -41 -49 -85 -18 -152 32 -68 32 -68 1 -126 -31 -58 -31 -82 -3 -161 l21 -62 -36 -70 c-43 -81 -44 -97 -16 -152 17 -34 19 -51 14 -105 -4 -35 -10 -64 -14 -64 -3 0 -31 14 -61 32 -145 83 -240 250 -240 421 0 187 129 374 306 446 68 28 81 26 46 -7z m344 -8 c119 -56 224 -186 259 -319 54 -210 -48 -440 -240 -542 l-60 -31 -3 73 c-2 59 1 81 17 111 28 51 26 71 -9 137 -35 66 -37 99 -10 158 26 58 25 87 -5 143 -31 58 -31 71 0 121 32 52 34 126 5 155 -26 26 -20 25 46 -6z m-762 -118 l86 -133 -15 -59 c-45 -174 9 -360 141 -483 74 -70 151 -109 251 -131 l73 -15 584 -895 c321 -492 582 -896 581 -898 -3 -3 -3639 59 -3643 63 -2 1 269 396 602 878 l605 874 41 6 c72 9 186 71 251 136 107 108 165 277 142 414 l-10 57 110 160 c61 88 112 160 113 160 1 0 41 -60 88 -134z m1386 -1773 c355 -548 651 -1007 659 -1021 l13 -25 -383 6 c-211 4 -1185 21 -2164 37 -978 17 -1781 33 -1783 35 -2 2 299 442 670 979 582 844 676 974 694 970 11 -3 50 -8 85 -12 l65 -7 -604 -873 c-332 -480 -602 -875 -600 -877 4 -4 583 -15 3301 -62 l389 -6 -51 79 c-28 43 -293 450 -589 904 l-538 825 65 12 c37 6 77 16 91 22 14 5 27 10 30 10 3 1 295 -447 650 -996z m-1022 -1030 c127 -7 127 -6 96 -95 -41 -123 -165 -194 -370 -214 l-72 -6 -24 43 c-53 94 -148 270 -148 274 0 7 389 6 518 -2z"/> <path d="M945 4656 c-42 -18 -93 -63 -110 -97 -8 -15 -14 -50 -14 -76 l2 -48 6 55 c4 30 12 65 19 77 13 24 73 73 89 73 5 0 18 7 29 15 23 18 18 18 -21 1z"/> <path d="M2600 3721 c0 -51 0 -51 33 -51 78 0 138 -37 123 -75 -7 -21 -79 -36 -127 -29 -31 5 -40 4 -35 -4 10 -16 115 -15 146 1 19 10 25 20 25 47 0 30 -5 38 -35 52 -19 10 -52 18 -72 18 -37 0 -38 1 -38 39 0 22 -4 43 -10 46 -6 4 -10 -13 -10 -44z"/> <path d="M2592 3490 c-61 -13 -139 -58 -179 -105 -60 -68 -105 -176 -110 -258 -5 -85 13 -129 66 -164 45 -30 61 -29 161 12 106 44 140 44 231 0 41 -19 88 -35 105 -35 74 0 129 92 129 215 -2 209 -203 377 -403 335z m162 -20 c23 -8 26 -15 26 -60 0 -43 -5 -55 -32 -85 -27 -29 -43 -37 -83 -41 -92 -11 -151 31 -162 115 -6 42 5 53 66 72 38 11 155 11 185 -1z"/> <path d="M2551 2799 c-30 -5 -69 -17 -85 -27 l-31 -18 -6 -155 c-7 -207 4 -321 45 -439 18 -52 35 -102 39 -110 4 -10 -4 -22 -25 -35 -54 -34 -92 -107 -96 -185 -4 -60 -1 -75 24 -120 94 -173 334 -170 427 5 29 55 29 155 0 211 -30 57 -95 112 -148 126 -32 9 -45 17 -43 28 4 19 59 25 88 10 19 -10 23 -6 46 47 50 112 75 236 77 378 1 112 -1 136 -19 175 -12 25 -30 53 -40 62 -49 43 -157 63 -253 47z"/> <path d="M2580 5052 c0 -38 -3 -151 -7 -250 l-6 -182 46 0 47 0 0 250 0 250 -40 0 -40 0 0 -68z"/> <path d="M3181 4993 c-78 -292 -101 -381 -101 -394 0 -11 14 -20 38 -26 l38 -10 57 216 c32 119 57 219 57 223 0 6 -55 28 -71 28 -5 0 -13 -17 -18 -37z"/> <path d="M1972 4955 c-38 -16 -44 10 53 -210 31 -71 64 -145 71 -162 l14 -33 38 17 c20 10 38 18 39 18 6 3 -165 379 -173 382 -5 1 -24 -4 -42 -12z"/> <path d="M4220 4666 c0 -2 20 -14 45 -26 25 -12 54 -33 65 -47 25 -33 42 -94 35 -130 l-5 -28 11 27 c14 35 -3 97 -38 138 -28 34 -113 83 -113 66z"/> <path d="M456 850 c-65 -20 -109 -88 -104 -160 3 -46 1 -50 -32 -72 -46 -31 -65 -82 -51 -135 13 -46 70 -108 115 -123 29 -9 31 -13 28 -49 -5 -53 28 -125 70 -151 26 -17 45 -20 90 -17 107 6 192 92 193 193 0 70 -18 74 -27 6 -20 -171 -244 -233 -289 -81 -17 54 -5 89 29 89 44 0 107 41 107 70 0 38 -45 56 -87 36 -18 -9 -42 -29 -53 -46 -15 -22 -25 -28 -40 -24 -40 13 -78 48 -97 91 -17 38 -18 49 -7 74 6 17 25 37 41 45 28 15 32 14 52 -5 30 -28 67 -40 94 -30 58 22 27 71 -52 83 -42 7 -46 10 -52 42 -17 93 75 160 170 124 33 -12 100 -82 116 -120 12 -30 40 -42 40 -17 0 17 -37 76 -69 110 -49 54 -131 83 -185 67z m14 -250 c12 -8 11 -10 -7 -10 -12 0 -25 5 -28 10 -8 13 15 13 35 0z m80 -181 c0 -12 -69 -43 -78 -35 -3 3 3 15 13 26 19 21 65 28 65 9z"/> <path d="M897 593 c51 -2 135 -2 185 0 51 1 10 3 -92 3 -102 0 -143 -2 -93 -3z"/> <path d="M938 443 c84 -2 219 -2 300 0 81 1 12 3 -153 3 -165 0 -231 -2 -147 -3z"/> </g> </svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" version="1.1" data-svg-name="custom icon-coffee-question"><path d="M 277.500 12.581 C 261.018 16.554, 252.233 20.933, 242.691 29.932 C 229.159 42.694, 226.791 52.997, 235.191 62.564 C 239.389 67.346, 242.936 69, 248.990 69 C 255.889 69, 260.311 66.480, 267.331 58.547 C 270.538 54.923, 274.996 51.023, 277.237 49.879 C 286.548 45.129, 301.167 48.761, 306.761 57.215 C 308.731 60.191, 309.516 62.823, 309.789 67.367 C 310.586 80.628, 302.895 89.289, 283.879 96.546 C 264.080 104.102, 258.545 108.575, 254.863 120 L 252.768 126.500 222.134 126.149 C 205.285 125.956, 191.347 125.653, 191.160 125.475 C 190.973 125.298, 192.640 122.742, 194.865 119.795 C 197.090 116.848, 200.168 111.751, 201.705 108.468 C 204.236 103.063, 204.500 101.457, 204.500 91.448 C 204.500 80.688, 204.401 80.196, 200.741 72.790 C 189.011 49.056, 160.052 41.188, 133.643 54.561 C 117.475 62.747, 105.993 80.524, 106.004 97.355 C 106.008 104.902, 108.272 109.078, 113.921 111.960 C 118.985 114.543, 123.015 114.543, 128.079 111.960 C 133.290 109.301, 135.550 105.402, 136.814 96.889 C 138.112 88.142, 140.434 84.147, 146.014 81.058 C 158.087 74.374, 170.345 81.343, 170.325 94.878 C 170.316 101.303, 168.104 106.363, 161.531 115 C 159.229 118.025, 156.288 122.407, 154.995 124.738 C 153.194 127.987, 151.928 129.086, 149.573 129.446 C 104.013 136.414, 82.403 142.048, 59.370 152.962 C 37.188 163.474, 24.158 176.275, 22.371 189.312 C 20.827 200.574, 32.003 280.811, 40.976 322.889 C 49.740 363.989, 62.109 405.402, 75.506 438.500 C 84.426 460.537, 87.482 466.532, 92.571 471.972 C 102.224 482.292, 113.159 486.894, 141.205 492.438 C 194.208 502.916, 245.890 502.284, 298.844 490.512 C 317.244 486.421, 324.484 483.224, 332.816 475.510 C 340.348 468.536, 343.059 464.115, 349.069 449 L 353.641 437.500 362.335 437.317 C 367.116 437.216, 373.609 436.390, 376.764 435.482 C 383.178 433.635, 400.498 424.427, 411.362 417.088 C 448.512 391.990, 476.032 354.180, 487.122 313 C 489.014 305.973, 489.409 301.987, 489.402 290 C 489.394 276.963, 489.123 274.693, 486.722 267.500 C 480.086 247.624, 465.724 232.436, 448.836 227.436 C 438.899 224.494, 423.624 224.864, 414.052 228.280 C 409.956 229.741, 406.454 230.787, 406.271 230.604 C 406.087 230.421, 406.399 225.372, 406.962 219.385 C 407.526 213.398, 408.063 203.749, 408.155 197.943 C 408.305 188.558, 408.043 186.781, 405.802 181.943 C 399.063 167.399, 379.992 154.506, 350.500 144.559 C 337.346 140.122, 319.923 135.776, 305.520 133.340 C 299.734 132.361, 295 131.319, 295 131.025 C 295 130.731, 300.129 128.759, 306.397 126.643 C 326.261 119.936, 333.643 115.253, 342.092 104 C 349.555 94.060, 352.192 86.628, 352.765 73.923 C 353.551 56.511, 348.913 44.900, 336.010 31.980 C 323.526 19.478, 308.596 13.220, 289.500 12.485 C 284 12.273, 278.600 12.316, 277.500 12.581 M 183.733 135.693 C 182.171 136.100, 182.034 137.042, 182.550 143.827 C 183.053 150.436, 182.854 151.944, 181.111 154.701 C 178.930 158.153, 174.812 160.736, 170.926 161.090 C 160.358 162.053, 156.261 157.517, 152.575 140.777 C 152.066 138.463, 151.565 138.124, 149.238 138.513 C 147.732 138.765, 139.300 140.141, 130.500 141.570 C 94.395 147.435, 64.188 157.841, 46.382 170.547 C 39.070 175.765, 35.388 179.914, 32.698 185.969 C 30.830 190.174, 30.783 191.176, 31.911 202.969 C 36.980 256.009, 48.267 320.395, 60.051 363.500 C 67.449 390.561, 78.839 423.268, 90.415 450.692 C 94.056 459.319, 96.002 462.545, 99.757 466.181 C 109.423 475.539, 116.037 478.229, 142.242 483.463 C 193.120 493.624, 243.024 493.278, 294 482.412 C 309.962 479.009, 316.935 476.530, 323.243 472.012 C 330.609 466.737, 334.920 460.042, 341.599 443.500 C 344.708 435.800, 347.662 429.055, 348.165 428.511 C 348.685 427.948, 353.138 427.659, 358.512 427.840 C 369.395 428.206, 375.547 426.764, 386.391 421.303 C 414.101 407.348, 438.748 385.559, 455.734 360 C 485.612 315.040, 489.002 271.965, 464.583 247.546 C 457.483 240.446, 450.500 236.728, 441 234.988 C 429.932 232.962, 416.739 235.446, 406.402 241.505 C 404.060 242.877, 401.227 244, 400.107 244 C 396.363 244, 396.015 241.270, 397.542 223.908 C 399.842 197.767, 399.775 189.285, 397.231 184.381 C 389.877 170.211, 363.495 156.215, 326.565 146.890 C 315.664 144.138, 285.999 138.614, 285.469 139.237 C 285.346 139.382, 284.334 141.300, 283.220 143.500 C 279.657 150.536, 274.439 154, 267.403 154 C 259.625 154, 251.568 147.403, 250.396 140.077 C 249.867 136.768, 249.340 136.118, 246.764 135.603 C 243.314 134.913, 186.413 134.994, 183.733 135.693 M 244.788 158.156 C 237.050 160.292, 230.713 168.121, 228.562 178.203 L 227.985 180.907 211.620 181.203 L 195.256 181.500 193.086 176.768 C 189.968 169.964, 184.042 166.612, 176.146 167.183 C 172.241 167.466, 169.330 168.341, 167.162 169.885 C 163.729 172.329, 160 178.617, 160 181.960 C 160 183.082, 159.790 184, 159.534 184 C 156.757 184, 133.850 187.683, 124.500 189.633 C 105.034 193.692, 82.155 200.614, 83.662 201.987 C 86.415 204.496, 113.104 211.737, 133 215.372 C 160.216 220.346, 175.574 221.490, 215 221.482 C 254.535 221.474, 270.411 220.296, 296.967 215.400 C 317.158 211.678, 343.614 204.477, 346.374 201.952 C 348.725 199.801, 300.133 187.459, 281.500 185.475 C 272.029 184.467, 272.269 184.650, 272.213 178.373 C 272.091 164.887, 258.010 154.507, 244.788 158.156 M 413.976 260.320 C 402.428 265.072, 394.324 272.632, 389.593 283.070 C 388.145 286.265, 386.062 294.674, 384.533 303.500 C 379.804 330.798, 371.570 361.689, 362.441 386.378 C 359.998 392.983, 358 398.944, 358 399.623 C 358 402.615, 361.130 404, 367.821 403.967 C 376.715 403.924, 382.648 401.688, 393.734 394.204 C 423.889 373.846, 442.505 350.593, 452.441 320.873 C 458.591 302.481, 459.290 290.196, 454.862 278.361 C 451.975 270.645, 446.154 263.754, 439.882 260.628 C 432.801 257.100, 422.113 256.973, 413.976 260.320 M 417.698 268.444 C 412.460 270.312, 406.460 274.631, 402.955 279.057 C 399.329 283.635, 395.023 292.709, 395.010 295.800 C 395.004 297.064, 393.218 306.964, 391.039 317.800 C 386.613 339.818, 379.111 367.273, 372.936 384.055 C 370.685 390.172, 369.021 395.354, 369.238 395.571 C 370.925 397.258, 385.010 389.824, 397.166 380.830 C 424.040 360.947, 443.871 330.120, 448.106 301.645 C 451.015 282.085, 441.793 266.927, 427.054 267.044 C 423.999 267.068, 419.789 267.698, 417.698 268.444 M 104.296 311.949 C 88.542 321.150, 89.763 343.859, 106.429 351.619 C 115.120 355.666, 123.488 354.357, 130.552 347.845 C 141.586 337.674, 140.273 320.503, 127.832 312.270 C 124.470 310.045, 122.332 309.464, 116.590 309.216 C 110.205 308.939, 108.983 309.211, 104.296 311.949 M 264 320.594 C 254.234 324.825, 248.576 335.897, 251.006 346.026 C 252.671 352.967, 256.828 358.237, 263.105 361.365 C 270.047 364.824, 275.934 364.834, 282.832 361.397 C 304.312 350.693, 296.759 318.861, 272.782 319.039 C 269.877 319.061, 265.925 319.760, 264 320.594 M 147.201 385.028 C 142.880 389.053, 143.346 395.249, 148.204 398.368 C 149.759 399.367, 162.760 401.164, 188.500 403.940 C 209.400 406.193, 228.332 408.293, 230.570 408.605 C 233.998 409.083, 235.143 408.751, 237.820 406.498 C 241.924 403.044, 242.270 397.542, 238.600 394.094 C 236.382 392.011, 233.121 391.502, 195.850 387.433 C 173.657 385.010, 154.122 383.021, 152.439 383.014 C 150.730 383.006, 148.416 383.896, 147.201 385.028" stroke="none" fill-rule="evenodd"/></svg>',
  ].join("");

  const icons = Array.from(template.children).reduce((prev, curr) => {
    const data_svg_name = curr.getAttribute("data-svg-name");
    curr.removeAttribute("data-svg-name");
    prev[data_svg_name] = curr.outerHTML;
    return prev;
  }, {});

  return (name = "") => icons[name] || "";
};

var dataApp = () => {
  const config = {
    uid: "id-app-cf63f8b2c10e10008e773a856dd6a450db17857965db51fbc3006d8d810d939b",
    routes: new RouteHashCallback(),
    auth: "auth_Mj8Q5q3",
    url: {},
    user: {},
    svgIcon: svgIcon(),
    elements: {
      metaThemeColor: document.getElementById("meta-theme-color"),
      styleApp: document.getElementById("style-app"),
      meta: {
        color: document.getElementById("meta-theme-color"),
      },
      style: {
        app: document.getElementById("style-app"),
      },
      video: {
        player: null,
      },
    },
    permissions: {
      microphone: null,
    },
    reactivity: {
      users: observeValue([]),
    },
    values: {
      customEvents: ["change", "_theme", "submit"].reduce((prev, curr) => {
        prev[curr] = new CustomEvent(curr);
        return prev;
      }, {}),
      days: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
      ],
      months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      peerConnections: {},
      stream: null,
      streamDinamic: null,
    },
    functions: {
      exeCallback: (callback, ...params) => {
        try {
          return callback(...params);
        } catch (error) {
          return null;
        }
      },
      displayElement: (element, status) => {
        element.style.display = status ? "" : "none";
        return element;
      },
      array: (array) => {
        return Array.isArray(array) ? array : [];
      },
      dateStartEnd: (nDate) => {
        const out = {
          default: nDate,
          start: new Date(nDate.getFullYear(), nDate.getMonth(), 1),
          end: new Date(nDate.getFullYear(), nDate.getMonth() + 1, 1),
        };
        out.end.setMilliseconds(out.end.getMilliseconds() - 1);
        return out;
      },
      attributes: (attributes = {}) => {
        return attributes instanceof Object
          ? Object.entries(attributes)
              .map((entries) => `${entries[0]}="${entries[1]}"`)
              .join(" ")
          : attributes;
      },
    },
    fetchOptions: (options = {}) => {
      return {
        ...options,
        headers: {
          "Token-Auth": Cookie.get("auth_Mj8Q5q3"),
          ...(options?.headers ?? {}),
        },
        method: options?.method ?? "GET",
      };
    },
    socket: {
      io: null, // io("https://l8qn2l7t-4999.brs.devtunnels.ms/"),
    },
  };

  config.socket.io?.on("emit-data", (data) => {
    console.log(data);
    dispatchEvent(new CustomEvent("emit-data", { detail: data }));
  });

  navigator.permissions.query({ name: "microphone" }).then((response) => {
    config.permissions.microphone = response.state == "granted";
  });

  return config;
};

// import navigate from "./assets/navigate";
// import navigateBottom from "./assets/navigateBottom";

addEventListener("contextmenu", (e) => {
  if (e.target.getAttribute("data-allow-contextmenu") === null) {
    e.preventDefault();
  }
});

addEventListener("DOMContentLoaded", () => {
  sessionStorage.setItem("add-venta", false);

  window.dataApp = dataApp();
  theme();

  document.getElementById("app").append(
    replaceNodeChildren(
      createNodeFragment(`
        <div class="container">
            <div replace-node-children="navigate"></div>
            <div replace-node-children="routes"></div>
        </div>
        <div replace-node-children="footerVideoPlayer"></div>
        <div replace-node-children="navigateBottom"></div>
        <div replace-node-children="notification"></div>
    `),
      {
        routes: routes(),
        notification: eleAlert(),
        navigate: "",
        navigateBottom: "",
      }
    )
  );

  dispatchEvent(new CustomEvent("popstate"));
  dispatchEvent(new CustomEvent("_theme"));
  dispatchEvent(new CustomEvent("hashchange"));
});

// addEventListener("beforeinstallprompt", (e) => {
//   console.log(e);
// });
