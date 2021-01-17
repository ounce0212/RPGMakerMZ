/*:
@plugindesc
全回復コマンドTP回復 Ver1.1.0

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_TpRecover.js

@help
イベントコマンド[全回復]で、TPも回復するようにします。

TPは、TP持ち越しの特徴がある場合のみ回復します。
※ TP持ち越しがない場合は、回復はしていますがリセットされます。
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.0(2021/1/11)
- コピーライト更新
*/

// パラメータ定義
(() => {
    'use strict';

/**
 * 全回復
 *
 * @param {} params - 
 * @returns {boolean} 回復に成功したか
 */
Game_Interpreter.prototype.command314 = function(params) {
    this.iterateActorEx(params[0], params[1], actor => {
        actor.recoverAllTp();
    });
    return true;
};


/**
 * アクターを扱うクラスです。
 * このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
 * Game_Party クラス（$gameParty）からも参照されます。
 *
 * @class
 */

/**
 * 全回復
 */
Game_Actor.prototype.recoverAllTp = function() {
    this.clearStates();
    this._hp = this.mhp;
    this._mp = this.mmp;
    this._tp = this.maxTp();
};

})();
