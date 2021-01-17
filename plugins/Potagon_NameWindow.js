/*:
@plugindesc
名前ウィンドウ自動化 Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_NameWindow.js

@help
名前ウィンドウに何も入力してなくてもある程度自動で名前を設定します。

@param IgnoreEventName
@text 名前ウィンドウ除外イベント名
@desc 通常ウィンドウで文章の表示をするときにイベント名が
この文字列を含む場合、名前ウィンドウを表示しない
@default EV
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.1(2021/1/17)
- リファクタ(jshint で ES6 記法に統一)

・Ver1.1.0(2021/1/11)
- ベースプラグイン更新対応
- コピーライト更新
*/

// パラメータ定義
(() => {
    'use strict';

    // パラメータ用変数
    const plugin_name = Potagon.getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const IgnoreEventName = String(params.IgnoreEventName) || '';

/**
 * イベントコマンドを実行するインタプリタです。
 * このクラスは Game_Map クラス、Game_Troop クラス、
 * Game_Event クラスの内部で使用されます。
 *
 * @class
 */

/**
 * 文章の表示
 *
 * @param {array} params -
 * <ul>
 * <li>params[0] : 顔グラフィック名（"":未指定）
 * <li>params[1] : 顔グラフィックインデックス（0:未指定）
 * <li>params[2] : 背景タイプ（0:通常ウィンドウ 1:背景を暗くする 2:透明にする）
 * <li>params[3] : 表示位置（0:上 1:中 2:下）
 * <li>params[4] : 名前
 * </ul>
 * @returns {}
 */
Game_Interpreter.prototype.command101 = function(params) {
    if ($gameMessage.isBusy()) {
        return false;
    }

    $gameMessage.setFaceImage(params[0], params[1]);
    $gameMessage.setBackground(params[2]);
    $gameMessage.setPositionType(params[3]);

    if (params[4]) {
        // 名前が指定されている場合は、そちらを表示する。
        $gameMessage.setSpeakerName(params[4]);
    } else if (params[2] == 0) {
        // 通常ウィンドウの場合
        const event_name = $dataMap.events[this._eventId].name;

        if (params[0]) {
          // 顔グラフィックが指定されている場合
          const event = $gameMap._events[this._eventId];
          const image = event.page().image;

          if (image.characterName === params[0] && image.characterIndex === params[1]) {
              // 現在のページの歩行グラフィックと
              // 文章の表示の顔グラフィックが一致した場合、
              // イベント名を名前として表示
              $gameMessage.setSpeakerName(event_name);
          } else {
              // 現在のページの歩行グラフィックと
              // データベースのアクターの歩行グラフィックが一致した場合
              // アクターの名前を名前として表示
              let actor = null;
              for(let i = 1, l = $dataActors.length; i < l; i++) {
                  actor = $dataActors[i]
                  if(actor.characterName == params[0] && actor.characterIndex == params[1]) {
                    $gameMessage.setSpeakerName(actor.name);
                    break;
                  }
              }
          }
        } else if (event_name.includes(IgnoreEventName)) {
          // IgnoreEventName で指定されているイベント名の場合、名前ウィンドウは表示しない
        } else {
          // 顔グラフィックが指定されていない場合、イベント名を名前として表示
          $gameMessage.setSpeakerName(event_name);
        }
    }

    while (this.nextEventCode() === 401) {
        // Text data
        this._index++;
        $gameMessage.add(this.currentCommand().parameters[0]);
    }

    switch (this.nextEventCode()) {
        case 102: // Show Choices
            this._index++;
            this.setupChoices(this.currentCommand().parameters);
            break;
        case 103: // Input Number
            this._index++;
            this.setupNumInput(this.currentCommand().parameters);
            break;
        case 104: // Select Item
            this._index++;
            this.setupItemChoice(this.currentCommand().parameters);
            break;
    }

    this.setWaitMode("message");

    return true;
};

})();
