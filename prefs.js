import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class TouchNavBackPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings('org.gnome.shell.extensions.tnav');

        const page = new Adw.PreferencesPage({
            title: 'General',
            icon_name: 'preferences-system-symbolic',
        });

        const group = new Adw.PreferencesGroup({
            title: 'Button Placement',
        });

        const floatingRow = new Adw.SwitchRow({
            title: 'Floating',
            subtitle: 'Show as draggable floating button',
        });
        settings.bind('floating', floatingRow, 'active', 0);

        const sections = ['left', 'center', 'right'];
        const sectionLabels = ['Left', 'Center', 'Right'];
        const sectionRow = new Adw.ActionRow({
            title: 'Panel Section',
            subtitle: 'Used when Floating is disabled',
        });
        const sectionDropdown = Gtk.DropDown.new_from_strings(sectionLabels);
        sectionDropdown.valign = Gtk.Align.CENTER;
        sectionRow.add_suffix(sectionDropdown);

        const syncSectionFromSettings = () => {
            const value = settings.get_string('panel-section');
            const idx = Math.max(0, sections.indexOf(value));
            if (sectionDropdown.selected !== idx)
                sectionDropdown.selected = idx;
        };

        const syncVisibility = () => {
            sectionRow.visible = !settings.get_boolean('floating');
        };

        sectionDropdown.connect('notify::selected', () => {
            settings.set_string('panel-section', sections[sectionDropdown.selected] ?? 'right');
        });

        settings.connect('changed::panel-section', syncSectionFromSettings);
        settings.connect('changed::floating', syncVisibility);

        syncSectionFromSettings();
        syncVisibility();

        group.add(floatingRow);
        group.add(sectionRow);
        page.add(group);
        window.add(page);
    }
}
