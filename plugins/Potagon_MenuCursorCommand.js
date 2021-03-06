/*:
@plugindesc
メニューコマンドカーソル移動追加 Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_MenuCursorCommand.js

@help
メニューコマンドに ←→ または、QWキーで同様の処理を追加します。

@param MenuOk
@type boolean
@text メニュー←キー決定
@desc メニューで←キーで決定と同じ動作にする
@default false

@param MenuStatusCancel
@type boolean
@text メニューステータス→キーキャンセル
@desc メニューステータスで→キーでキャンセルと同じ動作にする
@default true

@param ItemCategoryQW
@type boolean
@text アイテムカテゴリQW操作
@desc アイテムカテゴリでQRでも←→キーと同じ動作にする
@default true

@param SkillTypeCursor
@type boolean
@text スキルタイプ←→操作
@desc スキルタイプで←→でもQRキーと同じ動作にする
@default true

@param StatusTypeCursor
@type boolean
@text ステータス←→操作
@desc ステータスで←→でもQRキーと同じ動作にする
@default true
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
    const MenuOk           = Potagon.convertBool(params.MenuOk);
    const MenuStatusCancel = Potagon.convertBool(params.MenuStatusCancel);
    const ItemCategoryQW   = Potagon.convertBool(params.ItemCategoryQW);
    const SkillTypeCursor  = Potagon.convertBool(params.SkillTypeCursor);
    const StatusTypeCursor = Potagon.convertBool(params.StatusTypeCursor);

// メニューで←キーで決定と同じ動作にする
if (MenuOk) {

/**
 * メニュー画面で表示するコマンドウィンドウです。
 *
 * @class
 */

/**
 * フレーム更新
 */
const _Window_MenuCommand_update = Window_MenuCommand.prototype.update;
Window_MenuCommand.prototype.update = function() {
    _Window_MenuCommand_update.apply(this, arguments);
    this.addProcessHandling();
};

/**
 * 決定やキャンセルなどのハンドリング処理（追加）
 *
 * @returns {}
 */
Window_MenuCommand.prototype.addProcessHandling = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated("left") && Input.isTriggered("left")) {
            return this.processOk();
        }
    }
};

}


// メニューステータスで→キーでキャンセルと同じ動作にする
if (MenuStatusCancel) {

/**
 * メニュー画面でパーティメンバーのステータスを表示するウィンドウです。
 *
 * @class
 */

/**
 * フレーム更新
 */
const _Window_MenuStatus_update = Window_MenuStatus.prototype.update;
Window_MenuStatus.prototype.update = function() {
    _Window_MenuStatus_update.apply(this, arguments);
    this.addProcessHandling();
};

/**
 * 決定やキャンセルなどのハンドリング処理（追加）
 *
 * @returns {}
 */
Window_MenuStatus.prototype.addProcessHandling = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated("right") && Input.isTriggered("right")) {
            return this.processCancel();
        }
    }
};

}


// アイテムカテゴリでQRでも←→キーと同じ動作にする
if (ItemCategoryQW) {

/**
 * アイテム画面またはショップ画面で、
 * 通常アイテムや装備品の分類を選択するウィンドウです。
 *
 * @class
 */

/**
 * フレーム更新
 */
const _Window_ItemCategory_update = Window_ItemCategory.prototype.update;
Window_ItemCategory.prototype.update = function() {
    _Window_ItemCategory_update.apply(this, arguments);
    this.addProcessCursorMove();
};

/**
 * カーソルの移動処理（追加）
 */
Window_ItemCategory.prototype.addProcessCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("pagedown")) {
            this.cursorRight(Input.isTriggered("pagedown"));
        }
        if (Input.isRepeated("pageup")) {
            this.cursorLeft(Input.isTriggered("pageup"));
        }
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

}


// スキルタイプで←→でもQRキーと同じ動作にする
if (SkillTypeCursor) {

/**
 *
 * @class
 */

/**
 * フレーム更新
 */
const _Window_SkillType_update = Window_SkillType.prototype.update;
Window_SkillType.prototype.update = function() {
    _Window_SkillType_update.apply(this, arguments);
    this.addProcessHandling();
};

/**
 * 決定やキャンセルなどのハンドリング処理（追加）
 *
 * @returns {}
 */
Window_SkillType.prototype.addProcessHandling = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated("right") && Input.isTriggered("right")) {
            return this.processPagedown();
        }
        if (Input.isRepeated("left") && Input.isTriggered("left")) {
            return this.processPageup();
        }
    }
};

/**
 * カーソルの移動処理（追加）
 */
Window_SkillType.prototype.addProcessCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (!this.isHandled("right") && Input.isTriggered("right")) {
            this.cursorPagedown();
        }
        if (!this.isHandled("left") && Input.isTriggered("left")) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

}


// ステータスで←→でもQRキーと同じ動作にする
if (StatusTypeCursor) {

/**
 * ステータス画面で表示する、フル仕様のステータスウィンドウです。
 *
 * @class
 */

/**
 * フレーム更新
 */
const _Window_Status_update = Window_Status.prototype.update;
Window_Status.prototype.update = function() {
    _Window_Status_update.apply(this, arguments);
    this.addProcessHandling();
};

/**
 * 決定やキャンセルなどのハンドリング処理（追加）
 *
 * @returns {}
 */
Window_Status.prototype.addProcessHandling = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated("right") && Input.isTriggered("right")) {
            return this.processPagedown();
        }
        if (Input.isRepeated("left") && Input.isTriggered("left")) {
            return this.processPageup();
        }
    }
};

}

})();
