/*:
@plugindesc
TP初期化0 Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_InitTp.js

@help
戦闘開始時のTPを0にします。

TP持ち越しの特徴がある場合は 0 ではなく、戦闘開始前のTPになります。

@param InitTp
@type number
@text 戦闘開始TP初期値
@desc 戦闘開始時のTP初期値
@default 0
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.1(2021/1/17)
- リファクタ(jshint で ES6 記法に統一)

・Ver1.1.0(2021/1/11)
- ベースプラグインを指定していなかったのを修正
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
    const InitTp = Number(params.InitTp || 0);

/**
 * TP の初期化
 */
Game_Battler.prototype.initTp = function() {
    this.setTp(InitTp);
};

})();
