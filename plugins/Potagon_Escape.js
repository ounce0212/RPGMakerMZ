/*:
@plugindesc
必ず逃走 Ver1.2.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_Escape.js

@help
逃走の成功率を100%にします。

@param EscapeRatio
@type number
@text 逃走成功率
@desc 100 で 100%、 50 で 50% の確率で
逃走に成功するようになります
@max 100
@min 1
@default 100

@param EscapeRatioVariable
@type variable
@text 逃走成功率変数
@desc 逃走成功率を管理する変数
@default 0
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.2.1(2021/1/17)
- リファクタ(jshint で ES6 記法に統一)

・Ver1.2.0(2021/1/11)
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
    const EscapeRatio         = Number(params.EscapeRatio || 1);
    const EscapeRatioVariable = Number(params.EscapeRatioVariable || 0);

/**
 * 戦闘の進行を管理する静的クラスです。
 *
 * @namespace
 */

/**
 * 逃走成功率の作成
 */
BattleManager.makeEscapeRatio = function() {
    let escape_ratio = EscapeRatio;
    if (EscapeRatioVariable != 0) { // ゲーム中に逃走成功率を変更するための変数を使う場合
        escape_ratio = $gameVariables.value(EscapeRatioVariable);
        if (escape_ratio <= 0) {
            escape_ratio = 100; // 変数が 0 以下の場合、強制的に 100% にする。
        }
    }
    this._escapeRatio = escape_ratio / 100;
};

})();
