{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell
  {
    nativeBuildInputs = with pkgs; [ docker-compose ];
  }
