import { Routes } from '@angular/router';
import { PermissionsGuard } from 'src/app/core/gaurds/permissions.guard';



export const Full_ROUTES: Routes = [
    {
        path: 'permissions',
        loadChildren: () => import('../../modules/permissions/permissions.module').then(m => m.PermissionsModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'masters',
        loadChildren: () => import('../../modules/masters/masters.module').then(m => m.MastersModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'dashboard',
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'op-patients',
        loadChildren: () => import('../../modules/op-patients/op-patients.module').then(m => m.OpPatientsModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'in-patients',
        loadChildren: () => import('../../modules/in-patients/in-patients.module').then(m => m.InPatientsModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'diagnostic-tests',
        loadChildren: () => import('../../modules/assign-diagnostic-tests/diagnostic-tests.module').then(m => m.DiagnosticTestsModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'labsmdl',
        loadChildren: () => import('../../modules/labsmdl/labs-management.module').then(m => m.LabsManagementModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'pharmacy',
        loadChildren: () => import('../../modules/pharmacy/pharmacy.module').then(m => m.PharmacyModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'staff',
        loadChildren: () => import('../../modules/staff/staff.module').then(m => m.StaffModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'doctor',
        loadChildren: () => import('../../modules/doctor/doctor.module').then(m => m.DoctorModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'references',
        loadChildren: () => import('../../modules/references/references.module').then(m => m.ReferencesModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'licensetracking',
        loadChildren: () => import('../../modules/licensetracking/licensetracking.module').then(m => m.LicensetrackingModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'accounts',
        loadChildren: () => import('../../modules/accounts/accounts.module').then(m => m.AccountsModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'hrmodule',
        loadChildren: () => import('../../modules/hrmodule/hrmodule.module').then(m => m.HrmoduleModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'medicalrecords',
        loadChildren: () => import('../../modules/medicalrecords/medicalrecords.module').then(m => m.MedicalrecordsModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'teleconsultation',
        loadChildren: () => import('../../modules/teleconsultation/teleconsultation.module').then(m => m.TeleconsultationModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'staffnumbers',
        loadChildren: () => import('../../modules/staffnumbers/staffnumbers.module').then(m => m.StaffnumbersModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'nuresing',
        loadChildren: () => import('../../modules/nuresing/nuresing.module').then(m => m.NuresingModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'assetmanagement',
        loadChildren: () => import('../../modules/assetmanagement/assetmanagement.module').then(m => m.AssetmanagementModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'vendormanagement',
        loadChildren: () => import('../../modules/vendormanagement/vendormanagement.module').then(m => m.VendormanagementModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'housekeeping',
        loadChildren: () => import('../../modules/housekeeping/housekeeping.module').then(m => m.HousekeepingModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'firemanagement',
        loadChildren: () => import('../../modules/firemanagement/firemanagement.module').then(m => m.FiremanagementModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'physiotherapy',
        loadChildren: () => import('../../modules/physiotherapy/physiotherapy.module').then(m => m.PhysiotherapyModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'ambulancetracker',
        loadChildren: () => import('../../modules/ambulancetracker/ambulancetracker.module').then(m => m.AmbulancetrackerModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'dietitian',
        loadChildren: () => import('../../modules/dietitian/dietitian.module').then(m => m.DietitianModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'stockinventory',
        loadChildren: () => import('../../modules/stockinventory/stockinventory.module').then(m => m.StockinventoryModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'digilocker',
        loadChildren: () => import('../../modules/digilocker/digilocker.module').then(m => m.DigilockerModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
    {
        path: 'nabh',
        loadChildren: () => import('../../modules/nabh/nabh.module').then(m => m.NabhModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },

    {
        path: 'casesheet',
        loadChildren: () => import('../../modules/casesheet/casesheet.module').then(m => m.CasesheetModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
        {
        path: 'kpis',
        loadChildren: () => import('../../modules/kpis/kpis.module').then(m => m.KpisModule),
        data: { roles: 3 }, canActivateChild: [PermissionsGuard]
    },
];