import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../shared/data.service';

@Component({
    selector: 'search-pane',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

    packageTypes: any;
    packageVersions: any;
    queue = [];

    packageForm: FormGroup;
    packageType: FormControl;
    packageName: FormControl;
    packageVersion: FormControl;
    packagePublisher: FormControl;
    isProcessing: FormControl;

    constructor(private dataService: DataService) {
        this.packageName = new FormControl();
        this.packageType = new FormControl();
        this.packageVersion = new FormControl();
        this.packagePublisher = new FormControl();
        this.isProcessing = new FormControl();

        this.packageForm = new FormGroup({
            type: this.packageType,
            name: this.packageName,
            version: this.packageVersion,
            publisher: this.packagePublisher
        });
    }

    ngOnInit(): void {
        this.dataService.getPackageTypes().then(data => {
            this.packageTypes = data;
            this.packageType.patchValue(data[0].value);
        });

        this.packageType.valueChanges.subscribe(value => {
            this.packageName.patchValue('');
            this.packageVersions = null;
            this.packageVersion.patchValue('');
            this.packagePublisher.patchValue('');
        });
    }

    searchForPackageInfo() {
        this.isProcessing.patchValue(true);
        const query = this.packageName.value;
        this.dataService.getPackageInfo(query).subscribe(versions => {
            this.packageVersions = versions;
            this.packageVersion.patchValue(this.packageVersions[0]);
            this.isProcessing.patchValue(false);
        });
    }

    download() {
        if (this.packageType.value === 'npm') {
            const query = this.packageName.value + '@' + this.packageVersion.value;

            this.queue.push({
                name: query,
                downloading: true
            });

            this.dataService.downloadNpmPackage(query).subscribe(result => {
                const index = this.queue.indexOf(x => x.name === query);
                this.queue.splice(index, 1);
            });
        }

        if (this.packageType.value === 'vs-code-extension') {
            const query = this.packagePublisher.value + '-' + this.packageName.value;
            this.queue.push({
                name: query,
                downloading: true
            });
            this.dataService.downloadVsCodeExtension(this.packagePublisher.value, this.packageName.value)
                .subscribe(result => {
                    const index = this.queue.indexOf(x => x.name === query);
                    this.queue.splice(index, 1);
                });
        }
    }
}
