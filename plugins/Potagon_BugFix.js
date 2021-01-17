/*:
@plugindesc
RPGツクールMZのバグ修正 Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_BugFix.js

@help
RPGツクールMZのバグを修正します。

必要ない修正はパラメータで無効に出来ます。

@param FixBattleEnemyDrawItem
@type boolean
@text 敵キャラウィンドウバグ修正
@desc 敵キャラを選択するウィンドウで制御文字が使えないバグ修正
@on 修正する
@off 修正しない
@default true

@param FixStatusEquipOver
@type boolean
@text 装備タイプバグ修正
@desc 装備タイプが7以上でステータスの装備の表示バグ修正
@on 修正する
@off 修正しない
@default false
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
    const FixBattleEnemyDrawItem = Potagon.convertBool(params.FixBattleEnemyDrawItem);
    const FixStatusEquipOver     = Potagon.convertBool(params.FixStatusEquipOver);

/**
 * バトル画面で、行動対象の敵キャラを選択するウィンドウです。
 *
 * @class
 */

 /**
  * 項目の描画
  *
  * @param {number} index -
  */
if (FixBattleEnemyDrawItem) {
    Window_BattleEnemy.prototype.drawItem = function(index) {
        this.resetTextColor();
        const name = this._enemies[index].name();
        const rect = this.itemLineRect(index);
        this.drawTextEx(name, rect.x, rect.y, rect.width);
    };
}

/**
 * オブジェクト初期化
 *     info_viewport : 情報表示用ビューポート
 *
 * @param {} rect -
 */
if (FixStatusEquipOver) {
    const _Window_StatusEquip_initialize = Window_StatusEquip.prototype.initialize;
    Window_StatusEquip.prototype.initialize = function(rect) {
        _Window_StatusEquip_initialize.apply(this, arguments);
        this.refresh();
        this.select(0);
        this.activate();
    };
}

})();
